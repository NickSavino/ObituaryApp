import './App.css';
import ObituaryCards from './ObituaryCards';
import ObituaryForm from './ObituaryForm';
import CardItem from './CardItem';

import { useState } from 'react';

function App() {
  
  const [cards, setCards] = useState([]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  

  const submitObituaryData = async (obituaryData) => {
    const url = "https://oadio4xsdvk5e7msjgft2gnhgy0aiggs.lambda-url.ca-central-1.on.aws/"

    const formData = {
      name: obituaryData.name,
      birthYear: obituaryData.birthYear,
      deathYear: obituaryData.deathYear,
      img: obituaryData.img,
    };

    console.log("FORM DATA: " + JSON.stringify(formData))

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "multipart/content-type",
        },
        body: JSON.stringify(formData),
    });

    console.log(response)
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Response Data: ", responseData);
  } catch (error) {
    console.error("Error: ", error);
  }
};

  const handleSubmit = (event) => {
    // Send ObituaryData to the Lambda function via lambda function url
    console.log(event)
    submitObituaryData(event)
    setIsFormOpen(false)
  };

  const handleFormCancel = () => {
    setIsFormOpen(false)
  };


  return (
    <div id="root">

      <div id="header">
        <div id='empty'></div>
        <div id='title'><h1>The Last Show</h1></div>
        <div id='new-obituary'><button onClick={() => setIsFormOpen(true)}>+ New Obituary</button></div>
      </div>


      <div id="main">
        <ObituaryCards cards={cards}/>
      </div>

      {isFormOpen == true ? (
        <ObituaryForm onSubmit={handleSubmit} onCancel={handleFormCancel} />
      )
      :
      (
        null
      )
      }

    </div>
  )
}

export default App;
