import React, { useState, ChangeEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './SelectLanguage.css';

interface FormData {
    langsFluent: number[];
    langsLearning: number[];
}

export default function SelectLanguage(props: {
    setLangsFluent: (langsFluent: number[]) => void,
    setLangsLearning: (langsLearning: number[]) => void
}) {
    const languages = [
        "🇬🇧 English",
        "🇪🇸 Spanish",
        "🇷🇺 Russian",
        "🇫🇷 French",
        "🇨🇳 Chinese",
        "🇯🇵 Japanese",
        "🇵🇹 Portuguese",
        "🇸🇦 Arabic"
    ];      

    const [formData, setFormData] = useState<FormData>({
        langsFluent: [],
        langsLearning: []
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const valueAsNumber = Number(value);
        
        setFormData(prevState => {
            let updatedArray: number[];
            if (name === "langsFluent") {
                if (prevState.langsFluent.includes(valueAsNumber)) {
                    updatedArray = prevState.langsFluent.filter(lang => lang !== valueAsNumber);
                } else {
                    updatedArray = [...prevState.langsFluent, valueAsNumber];
                }
                props.setLangsFluent(updatedArray);
                return { ...prevState, langsFluent: updatedArray };
            } else if (name === "langsLearning") {
                if (prevState.langsLearning.includes(valueAsNumber)) {
                    updatedArray = prevState.langsLearning.filter(lang => lang !== valueAsNumber);
                } else {
                    updatedArray = [...prevState.langsLearning, valueAsNumber];
                }
                props.setLangsLearning(updatedArray);
                return { ...prevState, langsLearning: updatedArray };
            }
            return prevState;
        });
    };

    useEffect(() => {
        props.setLangsFluent(formData.langsFluent)
        props.setLangsLearning(formData.langsLearning)
    }, [formData])

    return (
        <>
            <form className="form-container">
                <div className="fieldset-container">
                    <fieldset className="custom-fieldset">
                        <legend className="custom-legend">I am fluent in:</legend>
                        <div className="checkbox-group">
                            {languages.map((lang, idx) => (
                                <label className='checkbox-label' key={idx}>
                                    <input 
                                        className="checkbox-input" 
                                        type="checkbox" 
                                        name="langsFluent" 
                                        value={idx}
                                        onChange={handleChange} />
                                    {lang}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                    <fieldset className="custom-fieldset">
                        <legend className="custom-legend">I want to learn:</legend>
                        <div className="checkbox-group">
                            {languages.map((lang, idx) => (
                                <label className='checkbox-label' key={idx}>
                                    <input 
                                        className="checkbox-input" 
                                        type="checkbox" 
                                        name="langsLearning" 
                                        value={idx} 
                                        onChange={handleChange} />
                                    {lang}
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </div>
            </form>
        </>
    );
}
