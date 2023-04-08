import { useState } from "react"
import "./ObituaryForm.css"


function ObituaryForm({ onSubmit, onCancel }) {

  const [name, setName] = useState("Name of the deceased")
  const [birthYear, setBirthYear] = useState("")
  const [deathYear, setDeathYear] = useState("")
  const [img, setImg] = useState("")


  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
};

const formatDate = (date) => {
    const formatted = new Date(date).toLocaleString("en-US", options);
    if (formatted === "Invalid Date") {
        return "";
    }
    console.log(formatted)
    return formatted;
};

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ name, birthYear, deathYear, img })
  }

  const handleImgChange = (event) => {
    setImg(event.target.files[0]);
  };


  return (
    <form className="form" onSubmit={handleSubmit}>

        <button className="cancel-button" onClick={onCancel}>
            <img src="./images/exitForm.svg" alt="No Image"/>
        </button>

        <div className="heading">
            <h1>Create a New Obituary</h1>
            <img className="wings" src="./images/headstone.png" alt="No Image" />
        </div>        

        <div className="form-group">
            
            <label id='deceased-label' htmlFor="deceased-img-input"><em>Upload a photo of the deceased</em></label>
            <input 
                type="file" 
                id="deceased-img-input" 
                name="img" 
                accept="image/png, image/jpeg" 
                onChange={handleImgChange}
            />
            

            <input id="name" placeholder="Name of the deceased" onChange={(e) => setName(e.target.value)}/>

            <div className="birth-death">
                <div>
                    <label htmlFor="birth-year"><em>Born:</em></label>
                    <input 
                        id="birth-year" 
                        type="datetime-local" 
                        defaultValue={birthYear}  
                        onChange={(e) => setBirthYear(formatDate(e.target.value))}
                    />
                </div>

                <div>
                    <label htmlFor="death-year"><em>Died:</em></label>
                    <input 
                        id="death-year" 
                        type="datetime-local" 
                        defaultValue={deathYear}
                        onChange={(e) => setDeathYear(formatDate(e.target.value))}
                    />
                </div>

            </div>
        </div>

        <button type="submit" className="submit-obituary">Write Obituary</button>

    </form>
  )

  }


export default ObituaryForm;