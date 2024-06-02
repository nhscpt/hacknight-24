import React from 'react'
import {useState} from 'react'
import {Link} from 'react-router-dom'

import './SelectLanguage.css'

export default function SelectLanguage() {
    const languages = [
        "🇬🇧 English",
        "🇪🇸 Spanish",
        "🇷🇺 Russian",
        "🇫🇷 French",
        "🇨🇳 Chinese",
        "🇯🇵 Japanese",
        "🇵🇹 Portuguese",
        "🇸🇦 Arabic"
    ]      


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget).entries();

        // TODO: call API to submit this
    };

    return (
        <>
        <form className="form-container" onSubmit={handleSubmit}>
            <div className="fieldset-container">
                <fieldset className="custom-fieldset">
                    <legend className="custom-legend">I am fluent in:</legend>
                    <div className="checkbox-group">
                        {languages.map((lang, idx): JSX.Element => (
                            <label className='checkbox-label'>
                            <input className="checkbox-input" type="checkbox" name="langsFluent" value={idx} />
                            {lang}
                        </label>
                    ))}
                    </div>
                </fieldset>
                <fieldset className="custom-fieldset">
                    <legend className="custom-legend">I want to learn:</legend>
                    <div className="checkbox-group">
                        {languages.map((lang, idx): JSX.Element => (
                            <label className='checkbox-label'>
                            <input className="checkbox-input" type="checkbox" name="langsFluent" value={idx} />
                            {lang}
                        </label>
                    ))}
                    </div>
                </fieldset>
            </div>
            <input className="submit-button" type="submit" value="Submit" />
        </form>
        </>
    )
}