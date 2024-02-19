import { styled } from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
export const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;
export const AttachFileInput = styled.input`
  display: none;
`;
export const SubmitButton = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export const CancelButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export const DeleteFileButton = styled.button`
  background-color: transparent;
  color: tomato;
  border: 1px solid tomato;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;
