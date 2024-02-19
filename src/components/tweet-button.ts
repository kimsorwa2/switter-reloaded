import { styled } from "styled-components";

export const Button = styled.button`
  width: 80px;
  color: black;
  background-color: #f5f5f5;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;
  &.save,
  &.photo {
    background-color: #1d9bf0;
    color: white;
  }
  &.photo {
    width: 140px;
  }
  &:hover {
    opacity: 0.8;
  }
`;
