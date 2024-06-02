import { useState } from 'react';
import './TextField.css'

interface TextFieldProps {
    label: string;
    value: string;
    secret: boolean;
    onChange: (value: string) => void;
}

export default function TextField(props: TextFieldProps) {
    return (
        <div className="textfield-container">
            <label className="textfield-label">{props.label}</label>
            <input
                type={props.secret ? "password" : "text"}
                className="textfield-input"
                value={props.value}
                onChange={(e) => props.onChange(e.target.value)}
            />
        </div>
    )
}