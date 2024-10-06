import React, { useState, useEffect } from 'react';
import './template.css';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { Tags } from '../utils/skillsData';
import axios from 'axios';
import { FaHouse } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Template = () => {
    const [formData, setFormData] = useState({ title: "", imageURL: null });
    const [imageAsset, setImageAsset] = useState({ uri: null });
    const [selectedTags, setSelectedTags] = useState([]);
    const [templates, setTemplates] = useState([]);
    const navigate = useNavigate();
    const handleSelectedTag = (tag) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter((item) => item !== tag)
                : [...prevSelectedTags, tag]
        );
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await axios.get('http://localhost:3000/templates');
                setTemplates(response.data);
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };
        fetchTemplates();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        axios.post('http://localhost:3000/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then((response) => {
                const { filePath } = response.data;
                if (filePath) {
                    setImageAsset({ uri: filePath });
                    setFormData((prevData) => ({ ...prevData, imageURL: filePath }));
                } else {
                    console.error('No file path returned');
                }
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
                alert('Error uploading image');
            });
    };

    const handleTemplateSave = async (e) => {
        e.preventDefault();

        const templateName = templates.length > 0 ? `Template${templates.length + 1}` : "Template1";
        const templateData = {
            title: formData.title,
            imageURL: imageAsset.uri,
            tags: selectedTags,
            name: templateName,
            timestamp: new Date(),
        };

        try {
            await axios.post('http://localhost:3000/save-template', templateData);
            alert('Document saved successfully');

            // Clear the form data
            setFormData({ title: "", imageURL: null });
            setImageAsset({ uri: null });
            setSelectedTags([]);

            // Fetch updated templates
            const response = await axios.get('http://localhost:3000/templates');
            setTemplates(response.data);
        } catch (error) {
            console.error('Error saving document:', error);
            alert('Error saving document');
        }
    };

    const handleImageDelete = () => {
        if (!imageAsset.uri) return;

        axios.delete('http://localhost:3000/delete-image', {
            data: { imagePath: imageAsset.uri },
        })
            .then(() => {
                setImageAsset({ uri: null });
                setFormData((prevData) => ({ ...prevData, imageURL: null }));
            })
            .catch((error) => {
                console.error('Error deleting image:', error);
                alert('Error deleting image');
            });
    };

    const handleTemplateDelete = (id) => {
        axios.delete(`http://localhost:3000/templates/${id}`)
            .then(() => {
                // Filter out the deleted template from the state
                setTemplates((prevTemplates) => prevTemplates.filter((template) => template._id !== id));
            })
            .catch((error) => {
                console.error('Error deleting template:', error);
                alert('Error deleting template');
            });
    };

    return (
        <>
            
            <Link to={"/homeContainer"} className="icon"  style={{marginTop: '20px',marginLeft:'40px', display: 'flex',justifyContent: 'flex-start'}}> <FaHouse style={{ fontSize: '24px', marginRight: '8px' }} />Go to Home</Link>
            <div className='start'>
                <div className="left-side">
                    <div className="content">
                        <p>Create a new template</p>
                    </div>
                    <div className="section">
                        <p className='first'> TempID:</p>
                        <p className='second'>{templates.length > 0 ? `Template${templates.length + 1}` : "Template1"}</p>
                    </div>

                    {/* Form starts here */}
                    <form encType="multipart/form-data" onSubmit={handleTemplateSave}>
                        <input
                            className="inp"
                            type="text"
                            name="title"
                            placeholder='Template Title'
                            value={formData.title}
                            onChange={handleInput}
                        />

                        {/* File uploader section */}
                        <div className='up'>
                            {!imageAsset.uri ? (
                                <label className='lb'>
                                    <div className='ig'>
                                        <div className="in">
                                            <FaUpload size={24} />
                                            <p>Click to Upload</p>
                                        </div>
                                    </div>
                                    <input type="file" accept=".jpg, .jpeg, .png" onChange={handleImageUpload} style={{ display: 'none' }} />
                                </label>
                            ) : (
                                <div>
                                    <img
                                        src={imageAsset.uri}
                                        alt="Preview"
                                        style={{ maxWidth: '320px', maxHeight: '400px', marginTop: '20px' }}
                                    />
                                    <button className='delete-button' type="button" onClick={handleImageDelete}>
                                        <FaTrash size={24} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="tags">
                            {Tags.map((tag, i) => (
                                <div
                                    key={i}
                                    className={selectedTags.includes(tag) ? 'selected' : ''}
                                    onClick={() => handleSelectedTag(tag)}
                                >
                                    <p>{tag}</p>
                                </div>
                            ))}
                        </div>
                        <button className="save" type="submit">Save</button>
                    </form>
                    {/* Form ends here */}
                </div>

                <div className="right">
                    {templates.length > 0 ? (
                        templates.map((template) => (
                            <div className="template-item" key={template._id}>
                                <img src={template.imageURL} alt={template.title} />
                                <button className="delbtn" onClick={() => handleTemplateDelete(template._id)}>
                                    <FaTrash size={24} />
                                </button>
                                <p>{template.title}</p>
                            </div>
                        ))
                    ) : (
                        <p>No data</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Template;
