import React from 'react'
import Select from 'react-select'

const customStyles = {
    container: (provided) => ({
        ...provided,
        border: 'solid 1px rgb(111, 106, 106)',
        borderRadius: '25px',
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: '#212332',
        border: 'solid 1px rgb(111, 106, 106)',
        borderRadius: '25px',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#313342' : '#212332',
    }),
    singleValue: (provided, state) => ({
        ...provided,
        color: '#bbbbbb',
    }),
    noOptionsMessage: (provided, state) => ({
        ...provided,
        backgroundColor: '#212332',
    }),
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: '#212332',
        borderRadius: '10px',
        border: 'solid 1px rgb(111, 106, 106)',
    }),
    input: (provided, state) => ({
        ...provided,
        color: '#bbbbbb',
    }),
};

const Combobox = ({ options, value, onChange }) => (
    <Select options={options} styles={customStyles} value={value} onChange={onChange}/>
)

export default Combobox;