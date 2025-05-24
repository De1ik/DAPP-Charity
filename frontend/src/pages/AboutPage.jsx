import React, {useEffect} from "react";
import "../css/about.css";
import {Header} from "../components/Header.jsx";
import {Footer} from "../components/Footer.jsx";

export const AboutPage = () => {
    useEffect(() => {
        document.body.classList.add('donation-body');
        return () => {
            document.body.classList.remove('donation-body');
        };
    }, []);
    return (
        <>
            <Header/>
            <div className="page-content">
                <h1>About the Project</h1>
                <p>
                    Our DAO project is created to support charitable initiatives. You can create fundraising "jars",
                    donate using cryptocurrency, and ensure transparency through blockchain technology.
                </p>

                <h2>Our Mission</h2>
                <p>
                    Our goal is to make charity transparent, fast, and accessible to everyone.
                </p>

                <h2>Features</h2>
                <ul>
                    <li>Create charity jars</li>
                    <li>Accept donations via smart contracts</li>
                    <li>Vote on DAO initiatives</li>
                </ul>

                <h2>Technologies</h2>
                <p>
                    React, Solidity, Hardhat, Ethers.js, IPFS, DAO mechanics.
                </p>
                <h2>
                    This project was developed by:
                </h2>
                <ul className="team-list">
                    <li><span className="name">Sofiia Poklonova</span><span className="tg">tg: @Sfpkl</span></li>
                    <li><span className="name">Alisa Podolska</span><span className="tg">tg: @aliseyshn</span></li>
                    <li><span className="name">Artem Delikatnyi</span><span className="tg">tg: @delik17</span></li>
                    <li><span className="name">Yulian Kisil</span><span className="tg">tg: @For8st</span></li>
                    <li><span className="name">Dmytro Kovalenko</span><span className="tg">tg: @dimon22856</span></li>
                    <li><span className="name">Maksym Riabichenko</span><span className="tg">tg: @maksriabik</span></li>
                </ul>

            </div>
            <Footer/>
        </>
    );
};
