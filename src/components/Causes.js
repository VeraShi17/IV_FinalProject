const causeDefinitions = {
    "Maternal hemorrhage": `
          Maternal hemorrhage is defined as a cumulative blood loss of greater than or equal to 1,000 mL 
          or blood loss accompanied by signs or symptoms of hypovolemia (low blood volume) within 24 hours after the birth process. 
          This includes bleeding during pregnancy (antepartum), labor (intrapartum), or after delivery (postpartum). 
          Postpartum hemorrhage is the most common and can result from uterine atony, retained placenta, or trauma to the birth canal.
        `,
    "Maternal abortion and miscarriage": `
          Maternal deaths caused by unsafe abortion practices or complications from miscarriage. 
          Abortion is the termination of a pregnancy, which can be induced or spontaneous (miscarriage). 
          Unsafe abortion refers to procedures performed by unqualified individuals or in conditions lacking medical safety. 
          Miscarriage, also known as spontaneous abortion, is the loss of a pregnancy before 20 weeks of gestation, often due to chromosomal abnormalities or maternal health issues.
        `,
    "Maternal hypertensive disorders": `
          Maternal hypertensive disorders include conditions such as preeclampsia, eclampsia, and chronic hypertension. 
          Preeclampsia is characterized by high blood pressure and damage to organs such as the liver or kidneys during pregnancy. 
          Eclampsia involves the onset of seizures in a woman with preeclampsia and is a life-threatening emergency.
          Chronic hypertension refers to high blood pressure present before pregnancy or diagnosed before 20 weeks of gestation.
        `,
    "Maternal obstructed labor and uterine rupture": `
          Maternal obstructed labor occurs when the baby cannot pass through the birth canal due to physical obstruction, 
          often resulting in prolonged and painful labor. Uterine rupture is a tear in the wall of the uterus, typically during labor, 
          which can lead to severe bleeding and poses a significant risk to both the mother and the baby.
        `,
    "Ectopic pregnancy": `
          Ectopic pregnancy is a life-threatening condition where the fertilized egg implants outside the uterus, 
          most commonly in the fallopian tube. As the pregnancy grows, it can cause the tube to rupture, leading to severe internal bleeding. 
          Symptoms include abdominal pain, vaginal bleeding, and dizziness. Immediate medical intervention is crucial.
        `,
    "Indirect maternal deaths": `
          Indirect maternal deaths occur due to pre-existing medical conditions or conditions that develop during pregnancy, 
          which are not directly caused by pregnancy but are worsened by its physiological demands. 
          Examples include heart disease, diabetes, anemia, and infections like tuberculosis or malaria.
        `,
    "Late maternal deaths": `
          Late maternal deaths refer to maternal deaths that occur between 42 days and one year after delivery 
          due to complications from pregnancy or childbirth. These may result from conditions such as infections, blood clots, 
          or complications from cesarean sections that persist or worsen after the postpartum period.
        `,
    "Other direct maternal disorders": `
          This category includes various other direct complications related to pregnancy and childbirth, such as amniotic fluid embolism, 
          gestational trophoblastic diseases, and complications arising from multiple pregnancies. These disorders, 
          while less common, can be severe and require specialized medical care.
        `,
    "Maternal sepsis and other maternal infections": `
          Maternal sepsis refers to a life-threatening condition caused by the body's response to infection, leading to organ dysfunction. 
          It can result from infections of the uterus, amniotic fluid, or surgical wounds after delivery. 
          Other maternal infections include urinary tract infections and pneumonia, which, if left untreated, 
          can lead to severe complications during pregnancy or postpartum.
        `,
    "Maternal deaths aggravated by HIV/AIDS": `
          Maternal deaths caused by HIV/AIDS occur when the disease weakens the immune system, 
          making the mother more vulnerable to infections and complications during pregnancy. 
          In areas with limited access to antiretroviral therapy, HIV/AIDS can significantly increase maternal mortality rates. 
          Prevention of mother-to-child transmission (PMTCT) programs play a crucial role in reducing these deaths.
        `,
};


const CauseExplanations = () => {
    return (
        <div className="container my-5">
            <h2 className="mb-4">Definitions of Maternal Disorders</h2>
            <ul className="list-group">
                {Object.entries(causeDefinitions).map(([cause, definition]) => (
                    <li key={cause} className="list-group-item">
                        <h5 className="mb-2">{cause}</h5>
                        <p>{definition}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CauseExplanations;
