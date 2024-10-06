import React, { useEffect, useRef, useState, useCallback } from "react";
import './template1.css';
import { FaHouse, FaTrash, FaPenToSquare, FaPencil, FaPlus } from "react-icons/fa6";
import { BiSolidBookmarks } from "react-icons/bi";
import { BsFiletypePdf } from "react-icons/bs";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const Template1 = () => {

  const { pathname } = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const templateName = pathname.split("/").slice(-1)[0];
  const loadedTemplateId = searchParams.get("templateId");

  const token = localStorage.getItem('token');

  const resumeRef = useRef(null);
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [imageAsset, setImageAsset] = useState({ imageURL: null, isImageLoading: false });
  const [isEdit, setIsEdit] = useState(false);


  console.log(pathname, templateName, loadedTemplateId);

  const [formData, setFormData] = useState({
    fullname: "Karen Richards",
    professionalTitle: "Professional Title",
    personalDescription: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alia minus est culpa id corrupti nobis ullam harum, porro veniam facilis, obcaecati nulla magnam beatae quae at eos! Qui, similique laboriosam?`,
    refererName: "Sara Taylore",
    refererRole: "Director | Company Name",
    mobile: "+91 0000-0000",
    email: "urname@gmail.com",
    website: "urwebsite.com",
    address: "your street address, ss, street, city/zip code - 1234",
  });
  const [experiences, setExperiences] = useState([
    {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis voluptatibus minima tenetur nostrum quo aliquam dolorum incidunt.",
    },
  ]);
  const [skills, setSkills] = useState([{ title: "skill1", percentage: "75" }]);
  const [education, setEducation] = useState([{ major: "ENTER YOUR MAJOR", university: "Name of your university / college 2005-2009" }]);


  // template editable or not
  const toggleEditable = () => {
    setIsEdit(prev => !prev);
  };



  // Experience
  const addExperience = () => {
    setExperiences([...experiences, {
      year: "2012 - 2014",
      title: "Job Position Here",
      companyAndLocation: "Company Name / Location here",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
    }]);
  };

  const removeExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  const handleExpChange = (index, e) => {
    const { name, value } = e.target;
    const updatedExperiences = [...experiences];
    updatedExperiences[index][name] = value;
    setExperiences(updatedExperiences);
  };


  //Skill
  const addSkill = () => {
    setSkills([...skills, { title: "skill1", percentage: "75" }]);
  };

  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const handleSkillsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSkills = [...skills];
    updatedSkills[index][name] = value;
    setSkills(updatedSkills);
  };


  //Education  
  const addEducation = () => {
    setEducation([...education, {
      major: "ENTER YOUR MAJOR",
      university: "Name of your university / college 2005-2009"
    }]);
  };

  const removeEducation = (index) => {
    const updatedEdu = education.filter((_, i) => i !== index);
    setEducation(updatedEdu);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEdu = [...education];
    updatedEdu[index][name] = value;
    setEducation(updatedEdu);
  };


  //Pdf generate
  const generatePDF = async () => {
    // Access DOM element using useRef hook
    const element = resumeRef.current;
    if (!element) {
      alert("Unable to capture content");
      return;
    }
    try {
      // Convert DOM element to PNG
      const dataUrl = await htmlToImage.toPng(element);

      // Define A4 dimensions in mm
      const a4Width = 210;
      const a4Height = 297;

      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: [a4Width, a4Height],
      });

      // Calculate image dimensions
      const aspectRatio = a4Width / a4Height;
      const imgWidth = a4Width;
      const imgHeight = a4Width / aspectRatio;

      // Calculate vertical margin to center the image
      const verticalMargin = (a4Height - imgHeight) / 2;

      // Add image to PDF
      pdf.addImage(dataUrl, "PNG", 0, verticalMargin, imgWidth, imgHeight);

      // Save the PDF
      pdf.save("resume.pdf");
    } catch (err) {
      alert("Error occurred");
      console.error(err);
    }
  };

  //handle image
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImageAsset({ imageURL: url });
    } else {
      setImageAsset({ imageURL: null });
    }
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }, []);

  //save data in database
  const saveFormData = (e) => {
    e.preventDefault();

    const { fullname, professionalTitle, personalDescription, address, mobile, email, website, refererName, refererRole } = formData;

    const newFormData = new FormData();
    newFormData.append('fullname', fullname);
    newFormData.append('professionalTitle', professionalTitle);
    newFormData.append('personalDescription', personalDescription);
    newFormData.append('address', address);
    newFormData.append('mobile', mobile);
    newFormData.append('email', email);
    newFormData.append('website', website);
    newFormData.append('refererName', refererName);
    newFormData.append('refererRole', refererRole);
    newFormData.append('education', JSON.stringify(education));
    newFormData.append('experiences', JSON.stringify(experiences));
    newFormData.append('skills', JSON.stringify(skills));
    newFormData.append('profileImage', profileImage); 

    console.log([...newFormData.entries()]); 

    axios.post('http://localhost:3000/resume', newFormData, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(result => {

      })
      .catch(err => console.log(err));
  };


  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/resume', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log("responsedata", response.data);
      const imageUrl = response.data.image ? `http://localhost:3000/uploads/${response.data.image}` : null;
      setImageAsset({ imageURL: imageUrl });
      setFormData({
        fullname: response.data.fullname,
        professionalTitle: response.data.professionalTitle,
        personalDescription: response.data.personalDescription,
        mobile: response.data.mobile,
        email: response.data.email,
        website: response.data.website,
        address: response.data.address,
        refererName: response.data.refererName,
        refererRole: response.data.refererRole,
      });

      setEducation(response.data.education);
      setSkills(response.data.skills);
      setExperiences(response.data.experiences);

    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [token]);



  return (

    <div className="resume-template">
      <div className="upperbar">
        <Link to={"/homeContainer"} className="icon"> <FaHouse />Home</Link>
        <p style={{ color: '#333', cursor: 'pointer' }} onClick={() => navigate(-1)} > / Template1 /  </p>
        <p>Edit</p>
      </div>

      <div className="left">
        <div className="left-out">

          <div className="edit-button" onClick={toggleEditable}>
            {isEdit ? (
              <FaPenToSquare className="icon" />
            ) : (
              <FaPencil className="icon" />
            )}
            <p className="text">Edit</p>
          </div>

          <div className="save-button" onClick={saveFormData}>
            <BiSolidBookmarks className="icon" />
            <p className="text">Save</p>
          </div>

          <div className="download-container">
            <p className="download-text">Download :</p>
            <BsFiletypePdf className="download-icon" onClick={generatePDF} />
          </div>
        </div>


        <form encType="multipart/form-data">
          {/* image section */}

          <div className="resume-content" ref={resumeRef}>
            <div style={{ backgroundColor: 'black', gridColumn: 'span 4' }}>
              <div className="profile-pic">
                <img src={imageAsset.imageURL || "/default-profile.png"} alt="Profile" />
                {imageAsset.imageURL ? '' : <input type="file" onChange={handleFileSelect} name="profileImage" />}
              </div>


              {/* Education */}
              <div className="startone">
                <div className="education-section">
                  <p className="education-title">Education</p>
                  <div className="title-underline"></div>
                  {education.map((edu, index) => (
                    <div key={index} className="edu">
                      {isEdit ? (
                        <>
                          <input
                            type="text"
                            name="major"
                            value={edu.major}
                            onChange={(e) => handleEducationChange(index, e)}
                          />
                          <input
                            type="text"
                            name="university"
                            value={edu.university}
                            onChange={(e) => handleEducationChange(index, e)}
                          />

                          <div className="remove-icon" onClick={() => removeEducation(index)}>
                            <FaTrash />
                          </div>
                        </>
                      ) : (
                        <div>
                          <p>{edu.major}
                          </p>
                          <p>{edu.university}</p>

                        </div>
                      )}
                    </div>
                  ))}
                  {isEdit && (
                    <div className="add-icon" onClick={addEducation}>
                      <FaPlus />
                    </div>
                  )}
                </div>
              </div>

              {/*  reference*/}
              <div className="startone">
                <div className="education-section">
                  <p className="education-title">Reference</p>
                  <div className="title-underline"></div>
                  <div className="edu">
                    {isEdit ? (
                      <>
                        <input
                          type="text"
                          name="refererName"
                          value={formData.refererName}
                          onChange={handleChange}
                          className="reference-input"
                          readOnly={!isEdit}
                        />
                        <input
                          type="text"
                          name="refererRole"
                          value={formData.refererRole}
                          onChange={handleChange}
                          className="reference-role"
                          readOnly={!isEdit}
                        />
                      </>
                    ) : (
                      <div>
                        <p>{formData.refererName}</p>
                        <p>{formData.refererRole}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Phone Section */}
              <div className="asd">
                <div className="info-section">
                  <div className="info-bar"></div>
                  <div className="info-details">
                    <div className="info-header">
                      <p>Phone</p>
                    </div >
                    <div className="asdv">
                      {isEdit ? (
                        <input
                          type="text"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          className={`info-input ${isEdit ? "editable" : ""}`}
                          readOnly={!isEdit}
                        />
                      ) : (
                        <p>{formData.mobile}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Section */}
                <div className="info-section">
                  <div className="info-bar"></div>
                  <div className="info-details">
                    <div className="info-header">
                      <p>Email</p>
                    </div>
                    <div className="asdv">
                      {isEdit ? (
                        <input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`info-input ${isEdit ? "editable" : ""}`}
                          readOnly={!isEdit}
                        />
                      ) : (
                        <p>{formData.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Website Section */}
                <div className="info-section">
                  <div className="info-bar"></div>
                  <div className="info-details">
                    <div className="info-header">
                      <p>Website</p>
                    </div>
                    <div className="asdv">
                      {isEdit ? (
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className={`info-input ${isEdit ? "editable" : ""}`}
                          readOnly={!isEdit}
                        />
                      ) : (
                        <p>{formData.website}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="info-section">
                  <div className="info-bar"></div>
                  <div className="info-details">
                    <div className="info-header">
                      <p>Address</p>
                    </div>
                    <div className="asdv">
                      {isEdit ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className={`info-input ${isEdit ? "editable" : ""}`}
                          rows="2"
                          style={{ maxHeight: "auto", minHeight: "40px", resize: "none" }}
                          readOnly={!isEdit}
                        />
                      ) : (
                        <p>{formData.address}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* basic Info */}
            <div className="basicinfo"  >
              <div className="title-spacing"></div>
              <div className="title-header">
                <div className="fullname-container">
                  <input
                    type="text"
                    readOnly={!isEdit}
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className={`fullname-input ${isEdit ? "editable" : ""}`}
                  />
                </div>
                <input
                  value={formData.professionalTitle}
                  onChange={handleChange}
                  name="professionalTitle"
                  type="text"
                  readOnly={!isEdit}
                  className={`professional-title-input ${isEdit ? "editable" : ""}`}
                />
              </div>


              {/* About Me */}
              <div className="about-me-container">
                <div className="about-me-header">
                  <p>About Me</p>
                  <div className="about-me-divider"></div>
                  <textarea
                    readOnly={!isEdit}
                    className={`about-me-textarea ${isEdit ? 'editable' : ''}`}
                    name="personalDescription"
                    value={formData.personalDescription}
                    onChange={handleChange}
                    rows="4"
                  ></textarea>
                </div>

                {/* Experience */}
                <div className="about-me-header ">
                  <p className="work-experience-header">Work Experience</p>
                  <div className="work-experience-divider"></div>
                  <div className="experience-list">
                    {experiences.map((exp, index) => (
                      <div key={index} className="experience-item">
                        <div className="experience-year">
                          <input
                            value={exp.year}
                            onChange={(e) => handleExpChange(index, e)}
                            name="year"
                            type="text"
                            readOnly={!isEdit}
                            className={`experience-year-input ${isEdit ? 'edit-mode' : ''}`}
                          />
                        </div>
                        <div className="experience-title">
                          {isEdit && (
                            <div
                              onClick={() => removeExperience(index)}
                              className="delete-button"
                            >
                              <FaTrash />
                            </div>
                          )}
                          <input
                            value={exp.title}
                            onChange={(e) => handleExpChange(index, e)}
                            name="title"
                            type="text"
                            readOnly={!isEdit}
                            className={`experience-title-input ${isEdit ? 'edit-mode' : ''}`}
                          />
                          <input
                            value={exp.companyAndLocation}
                            onChange={(e) => handleExpChange(index, e)}
                            name="companyAndLocation"
                            type="text"
                            readOnly={!isEdit}
                            className={`experience-company-input ${isEdit ? 'edit-mode' : ''}`}
                          />
                          <textarea
                            readOnly={!isEdit}
                            className={`experience-description ${isEdit ? 'edit-mode' : ''}`}
                            name="description"
                            value={exp.description}
                            onChange={(e) => handleExpChange(index, e)}
                            rows="3"
                          ></textarea>
                        </div>
                      </div>
                    ))}
                    {isEdit && (
                      <div
                        onClick={addExperience}
                        className="add-experience-button"
                      >
                        <FaPlus className="text-base text-txtPrimary" />
                      </div>
                    )}
                  </div>
                </div>


                {/* Skills */}
                <div className="about-me-header ">
                  <p className="skills-header">Skills</p>
                  <div className="skills-divider"></div>
                  <div className="skills-list">
                    {skills.map((skill, index) => (
                      <div key={index} className="skill-item">
                        <div className="skill-item-content">
                          <div className="skill-title">
                            <input
                              value={skill.title}
                              onChange={(e) => handleSkillsChange(index, e)}
                              name="title"
                              type="text"
                              readOnly={!isEdit}
                              className={`skill-title-input ${isEdit ? 'edit-mode' : ''}`}
                            />
                            {isEdit && (
                              <input
                                value={skill.percentage}
                                onChange={(e) => handleSkillsChange(index, e)}
                                name="percentage"
                                type="text"
                                className={`skill-percentage-input ${isEdit ? 'edit-mode' : ''}`}
                              />
                            )}
                          </div>
                          {isEdit && (
                            <div className="skill-bars">
                              <div
                                onClick={() => removeSkill(index)}
                                className="delete-button"
                              >
                                <FaTrash style={{ fontSize: '1rem', color: '#4b5563' }} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="skill-bar">
                          <div
                            className="skill-bar-fill"
                            style={{ width: `${skill.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {isEdit && (
                      <div
                        onClick={addSkill}
                        className="add-skill-button"
                      >
                        <FaPlus style={{ fontSize: '1rem', color: '#4b5563' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

  );
};

export default Template1;
