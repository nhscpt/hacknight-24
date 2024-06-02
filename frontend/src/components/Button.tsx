import './Button.css';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function Button(props: ButtonProps) {
    return (
        <button className="button" onClick={props.onClick} disabled={props.disabled}>
            {props.label}
        </button>
    );
}