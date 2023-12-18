import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useBreedList from "./useBreedList";
import fetchSearch from "./fetchSearch";
import Results from "./Results";
import AdoptedPetContext from "./AdoptedPetContext";
const ANIMALS = ["bird", "cat", "dog", "rabbit", "reptile"];
const SearchParams = () => {
  const [requestParams, setRequestParams] = useState({
    location: "",
    animal: "",
    breed: "",
  });
  const [animal, setAnimal] = useState("");
  const [breeds] = useBreedList(animal);
  const [adoptedPet] = useContext(AdoptedPetContext);

  //   const locationHook = useState("");
  //   const location = locationHook[0];
  //   const setLocation = locationHook[1];
  //   useEffect(() => {
  //     requestPets();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);
  //   async function requestPets() {
  //     const res = await fetch(
  //       `http://pets-v2.dev-apis.com/pets?animal=${animal}&location=${location}&breed=${breed}`
  //     );
  //     const json = await res.json();
  //     setPets(json.pets);
  //   }
  const results = useQuery(["search", requestParams], fetchSearch);
  const pets = results?.data?.pets ?? [];
  return (
    <div className="my-0 mx-auto w-11/12">
      <form
        className="mb-10 flex flex-col items-center justify-center rounded-lg bg-gray-200 p-10 shadow-lg"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const obj = {
            animal: formData.get("animal") ?? "",
            breed: formData.get("breed") ?? "",
            location: formData.get("location") ?? "",
          };
          setRequestParams(obj);
        }}
      >
        {adoptedPet ? (
          <div className="pet image-container">
            <img src={adoptedPet.images[0]} alt={adoptedPet.name} />
          </div>
        ) : null}
        <label htmlFor="location">
          Location
          <input
            name="location"
            type="text"
            id="location"
            className="search-input"
            placeholder="Location"
          />
        </label>
        <label htmlFor="animal">
          Animal
          <select
            value={animal}
            id="animal"
            className="search-input"
            onChange={(e) => {
              setAnimal(e.target.value);
            }}
          >
            <option />
            {ANIMALS.map((animal) => (
              <option key={animal}>{animal}</option>
            ))}
          </select>
        </label>
        <label htmlFor="breed">
          Breed
          <select
            name="breed"
            id="breed"
            className="search-input grayed-out-disabled"
            disabled={breeds?.length === 0}
          >
            <option />
            {breeds?.map((breed) => (
              <option key={breed}>{breed}</option>
            ))}
          </select>
        </label>
        <button
          className="rounded border-none bg-orange-500 px-6 py-2
           text-white hover:opacity-50
        "
        >
          Submit
        </button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
