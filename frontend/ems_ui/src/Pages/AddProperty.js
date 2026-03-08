import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";

function AddPropertyForm(){
    const [PropertyName, setpropertyname] = useState("");
    //const [UnitDescription, setUnitdescription] = useState("");
   // const [Location, setUnitlocation] = useState("");
    const navigate = useNavigate();

      const handleSubmit = async (e) => {
    e.preventDefault(); // stop page reload
    
    const response = await fetch("http://localhost:5000/Data/AddProperty", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        propertyname: PropertyName
      })
    });
    if (response.ok) {
        console.log("ok");
      } else {
        console.log("bad response");
      }

//const res = await fetch("http://localhost:5000/User/whoami", {
   //   credentials: "include"
   // });

    
//const data = await res.json(); // parse JSON
//setUser(data);

//console.log("Username:", data.username); 
  };
    return(
        <div>
            <center>
                <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label><br />
                    <input
                        type="text"
                        value={PropertyName}
                        onChange={e =>  setpropertyname(e.target.value)}
                     />
                </div>

                <div>
                    <label>Description:</label><br />
                    <input
                        type="text"
                        
                        //onChange={e =>  setUnitdescription(e.target.value)}
                     />
                </div>

                
                <button type="submit">Submit</button>
                </form>
            </center>
        </div>
    );
}

export default AddPropertyForm;