import React, { useState, useEffect } from "react";
import GeoMap from "../components/GeoMap";
import StackAreaChart from "../components/StackAreaChart";
import BarChart from "../components/BarChart";
import Legend from "../components/Legend";
import CauseExplanations from "../components/Causes";
import * as d3 from "d3";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "../styles/finalproject.module.css";

const FinalProject = () => {
    const [geoDataUrl] = useState("/countries-50m.json");
    const [csvData, setCsvData] = useState([]);
    const [processedData, setProcessedData] = useState([]);
    const [barData, setBarData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("Global");
    const [availableCountries, setAvailableCountries] = useState(new Set());
    const [year, setYear] = useState(1980);

    useEffect(() => {
        let countrySet = new Set();
        // Load MMR data
        d3.csv("/MMR.csv").then((data) => {
            const processedData = data.map((d) => ({
                ...d,
                year: +d.year,
                val: +d.val,
            }));
            setCsvData(processedData);
        });

        // Load processed numbers of death
        d3.csv("/processed_numbers_of_death_1.csv").then((data) => {
            const processedData = data.map((d) => ({
                ...d,
                year: +d.year,
                val: +d.val,
            }));
            setProcessedData(processedData);
            data.forEach((d) => countrySet.add(d.location_name));
        });

        d3.csv("/processed_numbers_of_death_2.csv").then((data) => {
            const processedBarData = data.map((d) => ({
                ...d,
                year: +d.year,
                val: +d.val,
            }));
            setBarData(processedBarData);
            data.forEach((d) => countrySet.add(d.location_name));

            setAvailableCountries(countrySet);
        });
    }, []);

    const handleCountryClick = (country) => {
        if (availableCountries.has(country)) {
            setSelectedCountry((prevCountry) => (prevCountry === country ? "Global" : country));
        } else {
            alert("No data available for this country.");
        }
    };

    const handleYearChange = (event) => {
        setYear(+event.target.value);
    };

    const thresholds = [0, 10, 25, 50, 100, 250, 500, 1000];
    const colors = [
        "#fff5eb",
        "#fee6ce",
        "#fdd0a2",
        "#fdae6b",
        "#fd8d3c",
        "#f16913",
        "#d94801",
        "#8c2d04",
    ];

    return (
        <div className="container-fluid p-0">
            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light fixed-top" style={{ backgroundColor: "#ffffff" }}>
                <div className="container-fluid">
                    <div className="w-100 d-flex justify-content-center align-items-center position-relative">
                        <span
                            className="navbar-brand mb-0 h1 text-center"
                            style={{ fontSize: "1.5rem" }}
                        >
                            Maternal Mortality Across Globe (1980-2021)
                        </span>
                        <div className="position-absolute end-0">
                            <button
                                className={`btn ${styles.customOutlinePrimary} me-2`}
                                onClick={() => setSelectedCountry("Global")}
                            >
                                Reset to Global
                            </button>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => window.scrollTo({ top: -20, behavior: "smooth" })}
                            >
                                Scroll to Top
                            </button>
                        </div>
                    </div>
                </div>
            </nav>


            <div style={{ paddingTop: "60px" }}>
                <div className={`${styles.overviewSection} d-flex align-items-center`}>
                    <div className="container text-center">
                        <h2 className={`mb-4 ${styles.overviewHeading}`}>Overview</h2>
                        <ul className={`text-start mx-auto ${styles.overviewList}`}>
                            <li>
                                <strong>What is Maternal Mortality?</strong> Maternal mortality refers
                                to the death of a woman during pregnancy, childbirth, or within 42
                                days of delivery, due to complications related to pregnancy or its
                                management.
                            </li>
                            <li>
                                <strong>Maternal Mortality Ratio (MMR):</strong> The MMR is expressed
                                as the number of maternal deaths per 100,000 live births. It is a
                                critical indicator of a country's healthcare quality.
                            </li>
                            <li>
                                <strong>Global Numbers:</strong> Globally, over 295,000 maternal
                                deaths were recorded in 2017, with developing countries accounting
                                for 94% of these deaths.
                            </li>
                            <li>
                                <strong>Key Causes:</strong> Major causes of maternal deaths include
                                severe bleeding, infections, high blood pressure, complications from
                                delivery, and unsafe abortion.
                            </li>
                            <li>
                                <strong>Why This Dashboard?</strong> This dashboard enables users to
                                explore global maternal mortality trends, identify high-risk regions,
                                and analyze causes of maternal deaths.
                            </li>
                        </ul>
                    </div>
                </div>


                <div className={`d-flex justify-content-center align-items-center mb-4 ${styles.yearSelectorWrapper}`}>
                    <div className={`d-flex align-items-center ${styles.yearSelector}`}>
                        <label htmlFor="year" className={`me-3 ${styles.yearSelectorLabel}`}>
                            Year:
                        </label>
                        <input
                            id="year"
                            className={`${styles.formRange}`}
                            type="range"
                            min="1980"
                            max="2021"
                            step="1"
                            value={year}
                            onChange={handleYearChange}
                        />
                        <span className={`ms-3 ${styles.yearSelectorValue}`}>{year}</span>
                    </div>
                </div>


                {/* Main Layout */}
                <div className="row">
                    {/* GeoMap */}
                    <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center">
                        <div style={{ width: "100%", height: "auto", marginTop: "-120px" }}>
                            <h5 className="mb-3 text-center">
                                Maternal mortality ratio ({selectedCountry}):{" "}
                                {
                                    csvData.find(
                                        (d) => d.year === year && d.location_name === selectedCountry
                                    )?.val?.toFixed(2) || "No Data"
                                }
                            </h5>
                            <GeoMap
                                geoJsonUrl={geoDataUrl}
                                csvData={csvData}
                                year={year}
                                onCountryClick={handleCountryClick}
                                selectedCountry={selectedCountry}
                            />

                            <div className="d-flex justify-content-center align-items-center mt-3">
                                <div style={{ width: "70%", textAlign: "center", marginRight: "15px" }}>
                                    <Legend thresholds={thresholds} colors={colors} />
                                </div>

                                {/* Dropdown */}
                                <select
                                    className="form-select"
                                    style={{ width: "200px" }}
                                    value={selectedCountry}
                                    onChange={(e) => handleCountryClick(e.target.value)}
                                >
                                    <option value="Global">Global</option>
                                    {[...availableCountries]
                                        .filter((country) => country !== "Global") // Exclude "Global" from availableCountries
                                        .map((country) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                </select>

                            </div>
                        </div>
                    </div>


                    {/* Charts */}
                    <div className="col-lg-6 d-flex flex-column align-items-center">
                        {/* Bar Chart */}
                        <div className="mb-4" style={{ width: "70%", height: "290px", marginLeft: "50px" }}>
                            <h5 className="mb-3 text-center">
                                Number of maternal deaths by cause ({selectedCountry}):{" "}
                                {
                                    processedData.find(
                                        (d) =>
                                            d.year === year &&
                                            d.location_name === selectedCountry &&
                                            d.age_name === "All ages"
                                    )?.val?.toFixed(2) || "No Data"
                                }{" "}
                            </h5>
                            <BarChart
                                data={barData.filter((d) => d.year === year)}
                                selectedCountry={selectedCountry}
                            />
                        </div>

                        {/* Stack Area Chart */}
                        <div style={{ width: "70%", height: "250px", marginTop: "100px", marginLeft: "-100px" }}>
                            <h5 className="mb-3 text-center">
                                Number of maternal deaths ({selectedCountry})
                            </h5>
                            <StackAreaChart
                                data={processedData}
                                selectedCountry={selectedCountry}
                            />
                        </div>
                    </div>
                </div>

                <div className="container my-5">
                    <CauseExplanations />
                </div>

                {/* Footer */}
                <footer className="text-center mt-5 py-3 bg-light">
                    <p className="mb-1">
                        Data Source:
                        <a
                            href="https://vizhub.healthdata.org/gbd-results/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Global Burden of Disease Study 2021 (GBD 2021) Results
                        </a>
                    </p>
                    <small>
                        Global Burden of Disease Collaborative Network. Global Burden of Disease
                        Study 2021 (GBD 2021) Results. Seattle, United States: Institute for Health
                        Metrics and Evaluation (IHME), 2022.
                    </small>
                </footer>

            </div>
        </div>
    );
};

export default FinalProject;
