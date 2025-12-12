import React, { useState } from 'react';
import { FaCheckCircle, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './orgProfile.css'; // Assuming your styles are located here
import ChurchLogo from "../../assets/Church Logo.jpg";

const EdittableChurchProfilePage: React.FC = () => {
  const [churchData, setChurchData] = useState({
    name: 'Eternal Hope Ministries',
    establishmentYear: 2010,
    denomination: 'Pentecostal / Evangelical',
    email: 'contact@eternalhope.org.zm',
    phone: '+260961234567',
    address: '88 Sunrise Avenue, Kabwata, Lusaka, Zambia',
    profilePic: 'shieldLogo.png',
    socialLinks: {
      facebook: 'https://facebook.com/eternalhope',
      instagram: 'https://instagram.com/eternalhope',
      twitter: 'https://twitter.com/eternalhope',
    },
    leadership: [
      { role: 'Senior Pastor', name: 'Pastor Benjamin Mwale', yearStart: 2010, yearEnd: 'Present' },
      { role: 'Associate Pastor - Youth & Women', name: 'Pastor Lillian Chola', yearStart: 2015, yearEnd: 'Present' },
      { role: 'Associate Pastor - Outreach', name: 'Pastor Peter Zulu', yearStart: 2018, yearEnd: 'Present' },
    ],
    ministries: [
      { name: 'Children\'s Ministry', description: 'A ministry focused on nurturing children in their faith.' },
      { name: 'Youth Ministry', description: 'Empowering youth through spiritual teachings and activities.' },
      { name: 'Adult Ministries', description: 'Guiding adults in their spiritual journeys through various programs.' },
      { name: 'Community Outreach', description: 'Serving the community through charitable acts and outreach programs.' }
    ],
    coreValues: [
      'Faith & Worship', 
      'Community Service', 
      'Youth Empowerment', 
      'Leadership Development', 
      'Outreach & Evangelism'
    ],
    worshipTimes: {
      sunday: '8:00 AM (Traditional), 10:30 AM (Contemporary), 5:00 PM (Evening Praise)',
      midweek: 'Wednesday Bible Study & Prayer, 7:00 PM; Friday Youth Fellowship, 6:30 PM',
    },
    sacraments: ['Baptism (immersion)', 'Communion (monthly)', 'Child Dedication'],
    specialServices: ['Easter Sunrise', 'Christmas Eve', 'Annual Revival Week'],
    about: 'Eternal Hope Ministries is dedicated to bringing hope, transforming lives, and empowering communities through the love of Jesus Christ.',
    vision: 'To expand ministries, empower youth and women, and create a positive impact in Lusaka.',
    mission: 'To serve with love, share the Gospel, and transform communities through practical support and spiritual growth.',
  });

  const [isEditing, setIsEditing] = useState(false);

  // Handle input change
  const handleChange = (key: string, value: string) => {
    setChurchData(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // Add or remove ministries or core values
  const handleAddItem = (key: string) => {
    if (key === 'ministries') {
      setChurchData(prevState => ({
        ...prevState,
        ministries: [...prevState.ministries, { name: 'New Ministry', description: 'New description' }]
      }));
    } else if (key === 'coreValues') {
      setChurchData(prevState => ({
        ...prevState,
        coreValues: [...prevState.coreValues, 'New Core Value']
      }));
    }
  };

  const handleRemoveItem = (key: string, index: number) => {
    if (key === 'ministries') {
      const updatedMinistries = churchData.ministries.filter((_, idx) => idx !== index);
      setChurchData({ ...churchData, ministries: updatedMinistries });
    } else if (key === 'coreValues') {
      const updatedCoreValues = churchData.coreValues.filter((_, idx) => idx !== index);
      setChurchData({ ...churchData, coreValues: updatedCoreValues });
    }
  };


  return (
    <div className="orgProfileContainer">
      {/* Header */}
      <header>
        <div className="banner"></div>
        <div className="profile-wrapper">
          <img src={ChurchLogo} alt="Profile" className="profile-pic" />
        </div>
      </header>

      {/* Edit Button */}
      <div className="edit-btn-container">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="edit-btn">
            ✏️ &nbsp; Edit Profile
          </button>
        ) : null}
      </div>

      {/* Profile Info */}
      <section className="profile-info">
        <h1>
          {isEditing ? (
            <input
              type="text"
              value={churchData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter Church Name"
            />
          ) : (
            <>
              {churchData.name} <span className="verified-icon"><FaCheckCircle /></span>
            </>
          )}
        </h1>

        <p>
          {isEditing ? (
            <input
              type="text"
              value={churchData.denomination}
              onChange={(e) => handleChange('denomination', e.target.value)}
              placeholder="Enter Denomination"
            />
          ) : (
            `${churchData.denomination} Church in Lusaka, Zambia`
          )}
        </p>

        <p>
          <i>
            {isEditing ? (
              <input
                type="number"
                value={churchData.establishmentYear}
                onChange={(e) => handleChange('establishmentYear', e.target.value)}
                placeholder="Enter Establishment Year"
              />
            ) : (
              `Established: ${churchData.establishmentYear}`
            )}
          </i>
        </p>

        {/* Contact Information */}
        <div className="action-buttons">
          <a href={`mailto:${churchData.email}`} className="email-btn">
            <i><FaEnvelope style={{ marginRight: '0.5rem' }} /></i>
            <span className='email-profile'>Email Us</span>
          </a>
          <a href={`tel:${churchData.phone}`} className="action-button bg-gray">
            <FaPhone style={{ marginRight: '0.5rem' }} />
            Call Us
          </a>
        </div>

        {/* Social Icons */}
        {/*<div className="social-icons">
          <a href={churchData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
            <FaFacebook className="fa-lg" />
          </a>
          <a href={churchData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
            <FaInstagram className="fa-lg" />
          </a>
          <a href={churchData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
            <FaTwitter className="fa-lg" />
          </a>
        </div>*/}
      </section>

      {/* Main Content */}
      <main>
        {/* Left Column */}
        <div className="left-column">
          <div className="content-card">
            <h2>About Us</h2>
            {isEditing ? (
              <textarea
                value={churchData.about}
                onChange={(e) => handleChange('about', e.target.value)}
                placeholder="Enter a description about the church"
              />
            ) : (
              <p>{churchData.about}</p>
            )}

            <h3>Vision</h3>
            {isEditing ? (
              <textarea
                value={churchData.vision}
                onChange={(e) => handleChange('vision', e.target.value)}
                placeholder="Enter Church Vision"
              />
            ) : (
              <p>{churchData.vision}</p>
            )}

            <h3>Mission</h3>
            {isEditing ? (
              <textarea
                value={churchData.mission}
                onChange={(e) => handleChange('mission', e.target.value)}
                placeholder="Enter Church Mission"
              />
            ) : (
              <p>{churchData.mission}</p>
            )}
          </div>

          <div className="content-card">
            <h2>Leadership</h2>
            <div className="timeline">
              {churchData.leadership.map((member, index) => (
                <div key={index} className="timeline-item">
                  <h3>{isEditing ? (
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => {
                        const updatedLeadership = [...churchData.leadership];
                        updatedLeadership[index].role = e.target.value;
                        setChurchData({ ...churchData, leadership: updatedLeadership });
                      }}
                      placeholder="Enter Role"
                    />
                  ) : (
                    member.role
                  )}</h3>

                  <p>{isEditing ? (
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const updatedLeadership = [...churchData.leadership];
                        updatedLeadership[index].name = e.target.value;
                        setChurchData({ ...churchData, leadership: updatedLeadership });
                      }}
                      placeholder="Enter Name"
                    />
                  ) : (
                    member.name
                  )} | &nbsp;
                    {isEditing ? (
                      <input
                        type="number"
                        value={member.yearStart}
                        onChange={(e) => {
                          const updatedLeadership = [...churchData.leadership];
                          updatedLeadership[index].yearStart = e.target.value;
                          setChurchData({ ...churchData, leadership: updatedLeadership });
                        }}
                        placeholder="Year Start"
                      />
                    ) : (
                      member.yearStart
                    )}&nbsp;
                    - &nbsp;
                    {isEditing ? (
                      <input
                        type="number"
                        value={member.yearEnd}
                        onChange={(e) => {
                          const updatedLeadership = [...churchData.leadership];
                          updatedLeadership[index].yearEnd = e.target.value;
                          setChurchData({ ...churchData, leadership: updatedLeadership });
                        }}
                        placeholder="Year End"
                      />
                    ) : (
                      member.yearEnd
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card">
            <h2>Ministries & Programs</h2>
            <div className="space-y-5">
              {churchData.ministries.map((ministry, index) => (
                <div key={index}>
                  <h3>{isEditing ? (
                    <input
                      type="text"
                      value={ministry.name}
                      onChange={(e) => {
                        const updatedMinistries = [...churchData.ministries];
                        updatedMinistries[index].name = e.target.value;
                        setChurchData({ ...churchData, ministries: updatedMinistries });
                      }}
                      placeholder="Enter Ministry Name"
                    />
                  ) : (
                    ministry.name
                  )}</h3>

                  <p>{isEditing ? (
                    <textarea
                      value={ministry.description}
                      onChange={(e) => {
                        const updatedMinistries = [...churchData.ministries];
                        updatedMinistries[index].description = e.target.value;
                        setChurchData({ ...churchData, ministries: updatedMinistries });
                      }}
                      placeholder="Enter Ministry Description"
                    />
                  ) : (
                    ministry.description
                  )}</p>
                  {isEditing && <button onClick={() => handleRemoveItem('ministries', index)}>Remove</button>}
                </div>
              ))}
              {isEditing && <button onClick={() => handleAddItem('ministries')}>Add Ministry</button>}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="content-card">
            <h2>Contact Information</h2>
            <div className="contact-item">
              <i><FaEnvelope /></i>
              {isEditing ? (
                <input
                  type="email"
                  value={churchData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter Email"
                />
              ) : (
                <span>{churchData.email}</span>
              )}
            </div>
            <div className="contact-item">
              <i><FaPhone /></i>
              {isEditing ? (
                <input
                  type="tel"
                  value={churchData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Enter Phone Number"
                />
              ) : (
                <span>{churchData.phone}</span>
              )}
            </div>
            <div className="contact-item">
              <i><FaMapMarkerAlt /></i>
              {isEditing ? (
                <input
                  type="text"
                  value={churchData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter Address"
                />
              ) : (
                <span>{churchData.address}</span>
              )}
            </div>
          </div>

          <div className="content-card">
            <h2>Core Values</h2>
            <div className="check-list">
              {churchData.coreValues.map((value, index) => (
                <div key={index} className="check-list-item">
                  <i><FaCheckCircle /></i>
                  {isEditing ? (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => {
                        const updatedCoreValues = [...churchData.coreValues];
                        updatedCoreValues[index] = e.target.value;
                        setChurchData({ ...churchData, coreValues: updatedCoreValues });
                      }}
                      placeholder="Enter Core Value"
                    />
                  ) : (
                    value
                  )}
                  {isEditing && <button onClick={() => handleRemoveItem('coreValues', index)}>Remove</button>}
                </div>
              ))}
              {isEditing && <button onClick={() => handleAddItem('coreValues')}>Add Core Value</button>}
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        {isEditing && (
          <div className="save-btn-container">
            <button onClick={() => setIsEditing(false)} className="add-btn">
              Save Changes
            </button>
          </div>
        )}
      </main>

      <footer>&copy; 2025 {churchData.name}. All Rights Reserved.</footer>
    </div>
  );
};

export default EdittableChurchProfilePage;
