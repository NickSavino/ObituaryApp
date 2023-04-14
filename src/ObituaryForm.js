import { useState } from "react"
import "./ObituaryForm.css"


function ObituaryForm({ onSubmit, onCancel }) {

  const [name, setName] = useState("")
  const [birthYear, setBirthYear] = useState("")
  const [deathYear, setDeathYear] = useState("")
  const [img, setImg] = useState("")
  const [filename, setFilename] = useState("");

  const [fetching, setFetching] = useState(false)

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


    // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault()


    if (img == "") {
        alert("Please upload a photo of the deceased")
        return
    }

    if (name == "" || birthYear == "" || deathYear == "") {
        alert("Please fill out all fields")
        return
    }

    setFetching(true)
    const responseData = await onSubmit({ name, birthYear, deathYear, img })
    
    setFetching(false)
  }

  const handleImgChange = (event) => {
    setImg(event.target.files[0]);
    if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        setFilename(file.name);
      } else {
        setFilename("");
      }
  };


  return (
    <form className="form" onSubmit={handleSubmit}>
        
        { // Removes the cancel button when the form is submitting
        !fetching && 
        <button className="cancel-button" onClick={onCancel}>
            <img src="./images/exitForm.svg" alt="No Image"/>
        </button>}
     

        <div className="heading">
            <h1>Create a New Obituary</h1>
            <img className="wings" src="./images/headstone.png" alt="No Image" />
        </div>        

        <div className="form-group">
            
            <label id='deceased-label' htmlFor="deceased-img-input"><em>Upload a photo of the deceased:  </em>  {filename}</label>
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
                        defaultValue={formatDate(new Date())}  
                        onChange={(e) => setBirthYear(formatDate(e.target.value))}
                    />
                </div>

                <div>
                    <label htmlFor="death-year"><em>Died:</em></label>
                    <input 
                        id="death-year" 
                        type="datetime-local" 
                        defaultValue={formatDate(new Date())}
                        onChange={(e) => setDeathYear(formatDate(e.target.value))}
                    />
                </div>

            </div>
        </div>

        {
            fetching == false ? (
                <button type="submit" className="submit-obituary">Write Obituary</button>
            ) : (
                <>
                <div>Please Wait. It's not like they're gonna be late for something...</div>
                <div id="loading-bar-spinner" className="spinner"><div className="spinner-icon"></div></div>
                </>
            )
        }

    </form>
  )

  }


export default ObituaryForm;