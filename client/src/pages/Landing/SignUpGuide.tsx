import React from 'react';
import './Landing.css'; // Importing the CSS file

const SignUpGuide: React.FC = () => {
    return (
        <div className="SignUpGuideParentContainer">
            <div className="signUpGuideContainer">
                <h1>Welcome to the SCI-ELD Portal</h1>
                <div className="signUpGuideCard">
                    <h2>How would you like to proceed?</h2>
                    <div className="signUpGuideRow">
                        <div>
                            <button
                                onClick={() => window.location.href = '/org-register'}
                            >
                                Register Your Organization/Church
                            </button>
                            <p>
                                <a href="/register-organization" className="signUpGuideLinkText">
                                    If you are new to the portal, click here to register your organization/church.
                                </a>
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => window.location.href = '/org-login'}
                            >
                                Login to Your Organization/Church
                            </button>
                            <p>
                                <a href="/login-organization" className="signUpGuideLinkText">
                                    Already have an account? Login to your organization/church here.
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="signUpGuideCard">
                    <h2>Alternatively, you can:</h2>
                    <div className="signUpGuideRow">
                        <div>
                            <button
                                onClick={() => window.location.href = '/register'}
                            >
                                Register as a Member
                            </button>
                            <p>
                                <a href="/register-user" className="signUpGuideLinkText">
                                    Sign up as a member under an existing organization/church.
                                </a>
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => window.location.href = '/login'}
                            >
                                Login as a Member
                            </button>
                            <p>
                                <a href="/login-user" className="signUpGuideLinkText">
                                    If you're already a member, login here to access your account.
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpGuide;
