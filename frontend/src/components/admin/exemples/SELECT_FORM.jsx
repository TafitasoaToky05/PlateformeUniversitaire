import React, { useEffect, useState } from "react";
import axios from "axios";

function AjouterCours() {

    const [enseignants, setEnseignants] = useState([]);
    const [filieres, setFilieres] = useState([]);

    const [formData, setFormData] = useState({
        code_cours: "",
        titre: "",
        credits_ects: "",
        enseignant: "",
        filiere: ""
    });

    useEffect(() => {

        // Charger enseignants
        axios.get("http://127.0.0.1:8000/api/enseignants/")
        .then((response) => {
            setEnseignants(response.data);
        });

        // Charger filières
        axios.get("http://127.0.0.1:8000/api/filieres/")
        .then((response) => {
            setFilieres(response.data);
        });

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    return (

        <div>

            {/* Select Enseignant */}
            <select
                name="enseignant"
                value={formData.enseignant}
                onChange={handleChange}
            >

                <option value="">
                    Choisir un enseignant
                </option>

                {enseignants.map((enseignant) => (

                    <option
                        key={enseignant.id}
                        value={enseignant.id}
                    >
                        {enseignant.nom}
                    </option>

                ))}

            </select>

            {/* Select Filière */}
            <select
                name="filiere"
                value={formData.filiere}
                onChange={handleChange}
            >

                <option value="">
                    Choisir une filière
                </option>

                {filieres.map((filiere) => (

                    <option
                        key={filiere.id}
                        value={filiere.id}
                    >
                        {filiere.nom_filiere}
                    </option>

                ))}

            </select>

        </div>
    );
}

export default AjouterCours;