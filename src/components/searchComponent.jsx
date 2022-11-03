import React, {useState, useEffect} from "react";

//import {  Modal, ModalBody, ModalHeader } from "reactstrap";

const SearchComponent = () => {
    // setting the hooks
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [order, setOrder] = useState("");
    const [popup,setPop]=useState(false);   
    const [selectedProfile, setSelectedProfile] = useState([]);
    const [editPopup, setEditPop]=useState(false);   
    const [datatoEdit, setDatatoEdit] = useState({
                                                "id":1,
                                                "name":"Leanne Graham",
                                                "username":"Bret",
                                                "email":"Sincere@april.biz",
                                                "phone":"1-770-736-8031 x56442"});



    //fetch data from jsonplaceholder
    const apiUrl = "https://jsonplaceholder.typicode.com/users";

    const showData = async () => {
        const payload =   await fetch(apiUrl);
        const data = await payload.json();
        setUsers(data)
        setSelectedProfile(data[0]);
        
    }
    
    useEffect( () => {
        showData()
    }, []);


    //search method
    const searcher = (ev) => {
        setSearch(ev.target.value);
    }
    
    //filter method
    let results = [];
    if(!search){
        results = users;
    } else {
        results = users.filter((data) => data.name.toLowerCase().includes(search.toLowerCase()) 
                                       || data.username.toLowerCase().includes(search.toLowerCase())                                       
                                       || data.phone.toLowerCase().includes(search.toLowerCase())
                                       || data.email.toLowerCase().includes(search.toLowerCase())
                                       || data.website.toLowerCase().includes(search.toLowerCase()));
    } 

    //order by method
    const sortObjectByKey =  (array, key) => { 
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    const handleFilterByChange = (ev) => {
        let ky = ev.target.value;  
        setOrder(ev.target.value);
        sortObjectByKey(users,ky);       
    }

    //close popup
    const closePopup=()=>{
        setPop(false)
    }; 

    const closeEditPopup=()=>{
        setEditPop(false);
    }

    
    // rowclick  
    const  handleClickOpen = (ev) => {  
        let us = ev.target.closest('tr')?ev.target.closest('tr').id-1:ev.target.id-1;
        //-> delete entry  
        if((ev.target.parentNode.classList.contains('trash') || ev.target.parentNode.classList.contains('bi-trash'))) { 
            deleteEntry(us);

        }else{//-> show poup 
            setSelectedProfile(users[us]);       
            setPop(!popup);            
            ev.preventDefault();        
        }
    };

    //delete entry function
    const deleteEntry = (ide) => {        
        let newusers = users;   
        newusers = users.filter(user => user.id !== ide+1);
        setUsers(newusers);
        results = newusers; 
    }    

    // show add new user popup
    const showNewPopup = (ev) => {
        setEditPop(true);
        ev.preventDefault();
            
    }
    // handle new user data
    const handleAddUser = (ev) => {
        let myform = document.getElementById(ev.target.parentNode.classList[0]);
        if (validateForm(myform)){
            let elem = myform.elements;
            let newwuser = datatoEdit;

            for(let ks in newwuser){
                if(ks!=='id'){
                    newwuser[ks] = elem[ks].value
                }
            }

            newwuser.id = results.length+1;
            let temp = [...users, newwuser];
            setUsers(temp);
            results = users;        
            setEditPop(false);
        }
    }

    const validateForm = (f ) => {
        document.querySelector('#validation-messages').innerHTML = "";
        let els = f.elements;
        let cont =  els.length -1;
        for(var k in els){
            if(els[k].value==="") {
                document.querySelector('#validation-messages').innerHTML = `The value of ${els[k].id} can't be empty`;
                cont--;
            }
        };
        return cont===els.length-1;
    }

    //render the view
    return(
        <div className="row justify-content-center mt-3 mb-3 mt-xs-1 mb-xs-1">
            <div className="col-auto">
                {/* searchbar and filterbar */}
                <form>
                    <div className="row">
                        <div className="col col-sm-6">                            
                            <label htmlFor="search" className="col-sm-6 col-form-label">Search:</label>
                            <input name="search" id="search" type="text" value={search} onChange={searcher} placeholder="Search" className="form-control form-control" />
                        </div>

                        <div className="col col-sm-6">
                            <label htmlFor="orderby" className="col-sm-6 col-form-label">Order by:</label>
                            <select className="form-select form-select" id="orderby" name="orderby" value={order} onChange={handleFilterByChange}>
                                <option value="id">Id</option>
                                <option value="name">Name</option>
                                <option value="username">Username</option>
                                <option value="phone">Phone</option>
                                <option value="email">Email</option>
                                <option value="website">Website</option>
                            </select>
                        </div>
                    </div> 
                    {/*  Add user button*/}
                    <div className="row">
                        <div className="col-sm-12 mt-10"><button className="btn btn-success add-new-user"  onClick={showNewPopup}>Add new user</button></div>
                    </div>

                                 
                    {/* table of users */}                
                    <table className="table table-striped table-hover mt-5 shadow-lg datatable table-responsive">
                        <thead>
                            <tr className="bg-theader text-white">
                                <th>Id</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map ( (user) => (
                                <tr key={user.id} id={user.id} onClick={handleClickOpen} className="datarow">
                                    <td  className="td-id"><div className="captn">Id: </div>{user.id}</td>
                                    <td ><div className="captn">Name: </div> {user.name}</td>
                                    <td ><div className="captn">Username: </div>{user.username} </td>
                                    <td ><div className="captn">Phone: </div>{user.phone}</td>
                                    <td ><div className="captn">Email: </div><a href="mailto:{user.email}" target="_blank" rel="noreferrer">{user.email}</a></td>
                                    <td className="has-icon trash"><i className="bi bi-trash"></i></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </form>
                    
                     {/* add user popup */}          
                    <div>{editPopup?
                        <div className="modal fade show modal__edit" style={{display:'block'}} tabIndex="-1" id="editModal" role="dialog" aria-labelledby="editModal" aria-hidden="true">
                           <div className="modal-dialog modal-dialog-centered" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">Add user </h5>
                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeEditPopup}></button>
                                </div>
                                <div className="modal-body">                                
                                    <form id="adduserform" name="adduserform" method="post">                                        
                                        <div className="form-group mb-3">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" className="form-control" id="name" placeholder="Name" required />                                            
                                        </div>
                                        
                                        <div className="form-group mb-3">
                                            <label htmlFor="username">Username</label>
                                            <input type="text" className="form-control" id="username" placeholder="Username" required />
                                        </div>
                                        
                                        <div className="form-group mb-3">
                                            <label htmlFor="phone">Phone</label>
                                            <input type="text" className="form-control" id="phone" placeholder="Phone" required  />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input type="text" className="form-control" id="email" placeholder="Email" required  />
                                        </div>
                                        <div id="validation-messages" className="text-danger text-sm mt-3"></div>                                        
                                    </form>
                                </div>
                                <div className="adduserform modal-footer">
                                    <button type="button" className="btn btn-success" onClick={handleAddUser}>Save changes</button>
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeEditPopup}>Close</button>
                                </div>
                             </div> 
                            </div>
                        </div>
                        :""}
                    </div>
                   
                    {/* User info popup*/}
                    <div>{popup?
                        <div className="modal fade show" tabIndex="-1" id="showModal" style={{display:'block'}} role="dialog" aria-labelledby="showModal" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">User data </h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closePopup}></button>
                                    </div>
                                    <div className="modal-body show-user-data">                       
                                    <div className="form-group ">
                                            <label htmlFor="ide">Id</label>
                                            <input type="number" id="ide" className="form-control-plaintext" value={selectedProfile.id} readOnly />
                                        </div>
                                        
                                        <div className="form-group ">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" className="form-control-plaintext" id="name" placeholder="Name" readOnly value={selectedProfile.name} />
                                        </div>
                                        
                                        <div className="form-group ">
                                            <label htmlFor="username">Username</label>
                                            <input type="text" className="form-control-plaintext" id="username" placeholder="Username" value={selectedProfile.username} readOnly />
                                        </div>
                                        
                                        <div className="form-group ">
                                            <label htmlFor="username">Email</label>
                                            <input type="email" className="form-control-plaintext" id="email" placeholder="Email" value={selectedProfile.email} readOnly />
                                        </div>
                                        
                                        <div className="form-group ">
                                            <label htmlFor="phone">Phone</label>
                                            <input type="text" className="form-control-plaintext" id="phone" placeholder="Phone" value={selectedProfile.email} readOnly />
                                        </div>
                                        
                                        <div className="form-group ">
                                            <h4 className="mb-3">Address</h4>
                                            <label htmlFor="street">Street</label>
                                            <input type="text" className="form-control-plaintext" id="street" placeholder="Street" value={selectedProfile.address.street}  readOnly />
                                            
                                            <label htmlFor="suit">Suite</label>
                                            <input type="text" className="form-control-plaintext" id="suite" placeholder="Suite" value= {selectedProfile.address.suite} readOnly />
                                            
                                            <label htmlFor="city">City</label>
                                            <input type="text" className="form-control-plaintext" id="city" placeholder="City" value={selectedProfile.address.city} readOnly />
                                            
                                            <label htmlFor="zipcode">Zip code</label>
                                            <input type="text" className="form-control-plaintext" id="zipcode" placeholder="Zip Code" value={selectedProfile.address.zipcode} readOnly />
                                        </div>
                                        
                                        <div className="form-group ">
                                            <label htmlFor="geo" style={{float:'left'}}>Geo</label>
                                            <input type="text" style={{width:'15%', float:'left'}} className="form-control-plaintext" id="geo-lat" placeholder="lat" value={selectedProfile.address.geo.lat} readOnly />
                                            <input type="text" style={{width:'15%', float:'left'}} className="form-control-plaintext" id="geo-lng" placeholder="lat" value={selectedProfile.address.geo.lng} readOnly />
                                        </div>
                                        <div className="form-group">
                                            <h4>Company</h4>
                                            <label htmlFor="company-name">Name:</label>                                            
                                            <input type="text" className="form-control-plaintext" id="company-name" placeholder="Name" value={selectedProfile.company.name} readOnly />
                                            
                                            <label htmlFor="company-catchPhrase">CatchPhrase:</label>
                                            <input type="text" className="form-control-plaintext" id="company-catchPhrase" placeholder="CatchPhrase" value={selectedProfile.company.catchPhrase} readOnly />
                                            
                                            <label htmlFor="Bs">Bs:</label>
                                            <input type="text" className="form-control-plaintext" id="Bs" placeholder="Bs" value={selectedProfile.company.bs} readOnly />
                                        </div>
                                       
                                    </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closePopup}>Close</button>
                                </div>
                                </div>
                            </div>
                        </div>:""
                        }

                    </div>  

            </div>
        </div>
    )
};

export default SearchComponent;