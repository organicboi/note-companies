import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "../styles/Table.css";

const saveCompanies = (companies) => {
  try {
    localStorage.setItem("companies", JSON.stringify(companies));
    console.log("Companies saved successfully:", companies);
  } catch (error) {
    console.error("Failed to save companies:", error);
  }
};

const loadCompanies = () => {
  try {
    const serializedCompanies = localStorage.getItem("companies");
    return serializedCompanies ? JSON.parse(serializedCompanies) : [];
  } catch (error) {
    console.error("Failed to load companies:", error);
    return [];
  }
};

const Table = () => {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [companies, setCompanies] = useState(() => loadCompanies());
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formFields] = useState([
    { name: "companyName", label: "Company Name", type: "text" },
    { name: "ceoName", label: "CEO Name", type: "text" },
    { name: "emailAddress", label: "Email Address", type: "email" },
    { name: "messageSent", label: "Message Sent", type: "text" },
    { name: "timing", label: "Timing", type: "time" },
    { name: "date", label: "Date", type: "date" },
  ]);

  useEffect(() => {
    saveCompanies(companies);
  }, [companies]);

  const onSubmit = (data) => {
    if (editingId) {
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company.id === editingId ? { ...company, ...data } : company
        )
      );
      setEditingId(null);
    } else {
      const newCompany = {
        id: Date.now(),
        ...data,
      };
      setCompanies((prevCompanies) => [...prevCompanies, newCompany]);
    }
    reset();
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setCompanies((prevCompanies) =>
      prevCompanies.filter((company) => company.id !== id)
    );
  };

  const handleEdit = (company) => {
    setEditingId(company.id);
    setShowForm(true);
    Object.keys(company).forEach((key) => {
      setValue(key, company[key]);
    });
  };

  const toggleExpand = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="table-component">
      <button
        className="add-company-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "Add New Company"}
      </button>
      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit(onSubmit)}>
            {formFields.map((field) => (
              <div key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  {...register(field.name)}
                  id={field.name}
                  type={field.type}
                />
              </div>
            ))}
            <div>
              <input
                type="submit"
                value={editingId ? "Update Company" : "Add Company"}
              />
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    reset();
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      <div className="table-container">
        <h1>List of Companies</h1>
        <table>
          <thead>
            <tr>
              <th>SN.</th>
              <th>Company Name</th>
              <th>CEO Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <React.Fragment key={company.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{company.companyName}</td>
                  <td>{company.ceoName}</td>
                  <td>
                    <button onClick={() => toggleExpand(company.id)}>
                      {expandedId === company.id ? "👆" : "👇"}
                    </button>
                  </td>
                </tr>
                {expandedId === company.id && (
                  <tr className="expanded-row">
                    <td colSpan="4">
                      <div className="expanded-content">
                        {formFields.slice(2).map((field) => (
                          <div key={field.name}>
                            <strong>{field.label}:</strong>{" "}
                            {company[field.name]}
                          </div>
                        ))}
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(company)}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(company.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
