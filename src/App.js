import { useEffect, useState } from 'react';
import './App.css';
import Form from './Form';
import Table from './Table';

function App() {
  // object contact
  const contact = {
    id: 0,
    name: "",
    email: "",
    phone: ""
  }

  // states
  const [btnCreate, setBtnCreate] = useState(true)
  const [contacts, setContacts] = useState([])
  const [objContact, setObjContact] = useState(contact)

  // effect for contacts reading
  useEffect(() => {
    fetch("http://localhost:8080/read")
      .then(data => data.json())
      .then(converted => setContacts(converted))
  }, [])

  // peek data from form
  const typing = (e) => {
    setObjContact({...objContact, [e.target.name]:e.target.value})
  }

  // create contact
  const create = () => {
    fetch("http://localhost:8080/create", {
      method: "post",
      body: JSON.stringify(objContact),
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(data => data.json())
    .then(converted => {
      if (converted.message !== undefined) {
        alert(converted.message)
      } else {
        setContacts([...contacts, converted])
        alert("Contact created!")
        clean()
      }
    })
  }

  // clean form
  const clean = () => {
    setObjContact(contact)
    setBtnCreate(true)
  }

  // select contact
  const select = (index) => {
    setObjContact(contacts[index])
    setBtnCreate(false)
  }

    // delete contact
    const deleteContact = () => {
      fetch("http://localhost:8080/delete/" + objContact.id, {
        method: "delete",
        headers: {
          "Content-type": "application/json",
          "Accept": "application/json"
        }
      })
      .then(data => data.json())
      .then(converted => {
        alert(converted.message)
        let temp = [...contacts]
        let index = temp.findIndex((c) => {
          return c.id === objContact.id
        })
        temp.splice(index, 1)
        setContacts(temp)
        clean()
      })
    }
  

  return (
    <div>
      {/* test */}
      {/* <p>{JSON.stringify(objContact)}</p> */}

      {/* output */}
      <Form btn={btnCreate} 
        eventKeyboard={typing} 
        create={create}
        obj={objContact} 
        cancel={clean} 
        deleteContact={deleteContact} />
      <Table vector={contacts} 
        selected={select} />
    </div>
  );
}

export default App;
