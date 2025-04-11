import React, { useState } from 'react';
import Country from './Country';

const LanguagesList = ({ languages }) => {
    return (
        <>
            {Object.values(languages).map((language, index) => (
                <span key={index}>{language}{index < Object.values(languages).length - 1 ? ', ' : ''}</span>
            ))}
        </>
    );
};

const Content = ({ countries }) => {
    const [selectedCountry, setSelectedCountry] = useState(null);


    if(countries.length > 10 || countries.length == 0){
        return <p>Too many countries please specify your search</p>
    }

    return (
        <>
            {selectedCountry ? (
                <div>
                    <h2>{selectedCountry.name.common}</h2>
                    <p><strong>Capital:</strong> {selectedCountry.capital}</p>
                    <p><strong>Population:</strong> {selectedCountry.population}</p>
                    <img src={selectedCountry.flags.png} alt={`Flag of ${selectedCountry.name.common}`} width="150" />
                    <p>Languages : <LanguagesList languages={selectedCountry.languages} /></p>
                    <Country capital={selectedCountry.capital}/>
                    <button onClick={() => setSelectedCountry(null)}>Back</button>
                </div>
            ) : (
                countries.map((country, i) => (
                    <p key={i}>
                        {country.name.common}{' '}
                        <span>
                            <button onClick={() => setSelectedCountry(country)}>Show</button>
                        </span>
                    </p>
                ))
            )}
        </>
    );
};

export default Content;