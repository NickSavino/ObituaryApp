import './App.css';
import ObituaryCards from './ObituaryCards';
import ObituaryForm from './ObituaryForm';
import CardItem from './CardItem';

import { useEffect, useState } from 'react';

function App() {
  
  const [cardsData, setCardsData] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [activeGetRequest, setActiveGetRequest] = useState(false);

    useEffect(() => {
    setActiveGetRequest(true);
    const fetch = async () => {
      await fetchCards();
    }
    fetch();
    setActiveGetRequest(false);

  }, []);


  async function fetchCards() {
    const lambdaUrl = "https://23b5b4shl3opw2or2rjs7ordxq0mqpmw.lambda-url.ca-central-1.on.aws/"

    try {
      const response = await fetch(lambdaUrl, {
        method: "GET",
        headers: {
          "accept": "*/*",
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      

      const responseData = await response.json();
      console.log("Response Data: ", responseData);
      setCardsData(responseData);
    } catch (error) {
      console.error("Error: ", error);
    }
  };


  async function submitObituaryData (obituaryData) {
    const url = "https://mvfkz6us2rcdghnjowx2qjt2vi0grrng.lambda-url.ca-central-1.on.aws/"

    const formData = new FormData();

    console.log("Obituary Data: " + obituaryData)

    formData.append("name", obituaryData.name);
    formData.append("birthYear", obituaryData.birthYear);
    formData.append("deathYear", obituaryData.deathYear);
    formData.append("img", obituaryData.img);
    

    console.log("FORM DATA: " + formData)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "accept": "*/*",
        },
        body: formData,
    });

    console.log(response)
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("Response Data: ", responseData);

    const newCard = {
      name: responseData.name,
      birthYear: responseData.birth_year,
      deathYear: responseData.death_year,
      text: responseData.obituary_text,
      image_url: responseData.image_url,
      audio: responseData.audio_url,
    }
    setCardsData([...cardsData, newCard]);
    
  } catch (error) {
    console.error("Error: ", error);
  }
};

  const handleSubmit = async (event) => {
    // Send ObituaryData to the Lambda function via lambda function url
    console.log(event)

    // Submit the form
    const responseData = await submitObituaryData(event)
    // Fetch the cards again
    // Close the form
    setIsFormOpen(false)
    return responseData
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
        <ObituaryCards cardsData={cardsData}/>
      </div>

      {isFormOpen == true ? (
        <ObituaryForm onSubmit={handleSubmit} onCancel={handleFormCancel} activeGetRequest={activeGetRequest} />
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
