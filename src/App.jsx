
import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'


function App() {
//  node js sample data va get panna
const[users, setUsers] = useState([]);
// search panna filtered users ah set pannanum
const [filteredUsers, setFilteredUsers] = useState([]);
// modal open pannanum and close pannanum
const[isModalOpen, setIsModalOpen] = useState(false);
// type panra data va vangi api ku post pannanum
 const[userData , setUserData] = useState({name:'',age:'',city:''});



// sample.json data get pannanum
const getAllUsers = async () => {
  await axios.get('http://localhost:8000/users').then((res)=>{
    
    setUsers(res.data);
    setFilteredUsers(res.data);
  })
  console.log(users); 
}

useEffect(()=>{
  getAllUsers();

},[]);
// search panna filtered users ah set pannanum
const handleSearchChange = (e) => {
  const searchText = e.target.value.toLowerCase();
  const filteredUsers = users.filter((user)=>// search panna filtered users ah set pannanum
     user.name.toLowerCase().includes(searchText) || 
     user.city.toLowerCase().includes(searchText)
  );
  setFilteredUsers(filteredUsers);
}


// function delete
const handleDelete = async (id) => {
const isConfirmed = window.confirm("Are you sure want to delete this user?")
if(isConfirmed){
  await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
    setUsers(res.data);
    setFilteredUsers(res.data);

  })
}
}
// function close modal
const closeModal = () => {
  setIsModalOpen(false);
}


// function handle data
const handleData = (e) => {
  //spread operator and [e.target.name] is dynamic key enda name,age,city nu vandha athu key aagum
  setUserData({...userData,[e.target.name]:e.target.value});// type panra data va vangi api ku post pannanum
}
// function add record
const handleAddRecord = () => {
  setUserData({name:'',age:'',city:''});
  setIsModalOpen(true);
   }

// function submit
const handleSubmit = async (e) => {
  e.preventDefault();
  if (userData.id) {
    // Fixing the URL and syntax for the patch request
    await axios
      .patch(`http://localhost:8000/users/${userData.id}`, userData)
      .then((res) => {
        console.log(res);
      });
  } else {
    await axios
      .post('http://localhost:8000/users', userData)
      .then((res) => {
        console.log(res);
      });
  }
  closeModal();
  setUserData({ name: '', age: '', city: '' });
};

// Update user record
const handleUbdateRecord = (user) => {
  setUserData(user);
  setIsModalOpen(true);
};


  return (
    <>
      <div className="container">
        <h3>CRUD Application with React.js Frontend and 
          Node.js Backend</h3>

          <div className="input-search">
            <input type="search"  placeholder='Search Text Here' onChange={handleSearchChange}/>
            <button className='btn green'onClick={handleAddRecord} >Add Record</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Age</th>
                <th>City</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers &&
                filteredUsers.map((user,index)=>{
                  return(
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.name}</td>
                      <td>{user.age}</td>
                      <td>{user.city}</td>
                      <td><button className='btn green'onClick={()=>handleUbdateRecord(user)}>Edit</button></td>
                      <td><button onClick={()=>handleDelete(user.id)} className='btn red'>Delete</button></td>
                    </tr>
                  )
                })
              }
            </tbody>
          
            
          </table>
          
          {isModalOpen && (  //open le ituntha mattum modal open aagum
            <div className="modal">
              <div className="modal-content">
              
                <span className="close" onClick={closeModal}> &times;</span>    
                <h2>User Record</h2>
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" value={userData.name} onChange={handleData} name='name'id ="name" />
                </div>
                <div className="input-group">
                  <label htmlFor="age">Age</label>
                  <input type="number" value={userData.age} onChange={handleData} name='age'id ="age" />
                </div>
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <input type="text" value={userData.city} onChange={handleData} name='city'id ="city" />
                </div>
                <button className='btn green' onClick={handleSubmit}>Add User</button>
                
              </div>
            </div>
          )}
      </div>
        
    </>
  )
}

export default App
