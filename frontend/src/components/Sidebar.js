import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import '../App.css';

function Sidebar () {

    return (
        <div className="sidebar">
            <div className='sidebar-container-div'>
                <h1 className='h1-sidebar-heading' style={{marginBottom: '8px'}}>Every Tree in Dublin: An Urban Exploration</h1>
                <p className="summary" style={{marginBottom: '36px'}}>Amidst Dublin's storied streets, trees stand as silent witnesses to its vibrant history. From Georgian garden square’s in the city centre, to the shaded lanes of Phibsoboro, embark on a journey across Dublin's varied neighbourhoods. Understand the stories, the species, and the significance of these urban guardians.</p>
                <h2 style={{ marginBottom: '0px', fontSize: '15px'}}>Acknowledgements and Credits:</h2>
                <p>The formulation of the Dublin tree database used for this project was generously backed by a research grant from Ireland’s Environmental Protection Agency (EPA), and spearheaded by the School of Geography at University College Dublin. This tree database forms an integral part of the "Mapping Green Dublin" initiative, a larger project aimed at comprehensively charting Dublin's green assets.</p>                
                <p>For a deeper dive into Dublin's treescape, <a className='summary' href='https://zenodo.org/record/3813792#.YuJKj3bMLIV'>explore the full dataset here.</a></p>
            </div>
            <div className='social-wrapper'>
                <p style={{fontSize: '12px', fontWeight: '500', marginBottom: '4px'}}>Harry Ó Cléirigh</p>
                <h2 >Get in touch! 👇</h2>
                <div className="social-links">
                    <a href='https://github.com/harryocleirigh' target="_blank">
                        <div className='icon-holder'>        
                            <FontAwesomeIcon icon={faGithub}/>
                        </div>
                    </a>
                    <a href='https://www.linkedin.com/in/harry-%C3%B3-97818b14a/' target="_blank">
                        <div className='icon-holder'>
                            <FontAwesomeIcon icon={faLinkedinIn}/> 
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Sidebar