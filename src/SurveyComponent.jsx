import React, { useState, useEffect } from "react";
import { Model, surveyLocalization } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./index.css";
import { json } from "./json";
import { jsonQuiz } from "./jsonQuiz";
import { jsonEnd } from "./jsonEnd";

import { Serializer } from "survey-core";
import { ReactSurveyElement, ReactElementFactory } from "survey-react-ui";
import { themeJson } from "./theme";
import axios from "axios"; // If using axios

Serializer.addProperty("survey", "progressTitle");

// Set French localization for buttons
surveyLocalization.locales["fr"] = {
  pageNextText: "Suivant", // "Next" button text
  pagePrevText: "Précédent", // "Previous" button text
  completeText: "Terminer", // "Complete" button text
  startSurveyText: "Commencer",
};

surveyLocalization.currentLocale = "fr";

class PercentageProgressBar extends ReactSurveyElement {
  render() {
    return (
      <div className="sv-progressbar-percentage">
        <div className="sv-progressbar-percentage__title">
          <span>Progression</span>
        </div>
        <div className="sv-progressbar-percentage__indicator">
          <div
            className="sv-progressbar-percentage__value-bar"
            style={{ width: this.props.model.progressValue + "%" }}
          ></div>
        </div>
        <div className="sv-progressbar-percentage__value">
          <span>{this.props.model.progressValue + "%"}</span>
        </div>
      </div>
    );
  }
}

ReactElementFactory.Instance.registerElement(
  "sv-progressbar-percentage",
  (props) => {
    return React.createElement(PercentageProgressBar, props);
  }
);

function SurveyComponent() {
  const survey = new Model(json);
  const surveyQuiz = new Model(jsonQuiz);
  const surveyEnd = new Model(jsonEnd);
  const [quizStart, setQuizStart] = useState(false);
  const [canTakeTest, setCanTakeTest] = useState(true);

  // Check localStorage on component mount

  // Check localStorage on component mount

  // Check localStorage on component mount
  useEffect(() => {
    const lastSubmissionTime = localStorage.getItem("lastSubmissionTime");
    if (lastSubmissionTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(lastSubmissionTime, 10);
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference < 24) {
        setCanTakeTest(false);
      } else {
        // Clear the timestamp if more than 24 hours have passed
        localStorage.removeItem("lastSubmissionTime");
        setCanTakeTest(true);
      }
    }
  }, [canTakeTest]);

  survey.focusFirstQuestionAutomatic = true;
  survey.applyTheme(themeJson);

  surveyQuiz.focusFirstQuestionAutomatic = true;
  surveyQuiz.applyTheme(themeJson);

  surveyEnd.focusFirstQuestionAutomatic = true;
  surveyEnd.applyTheme(themeJson);

  survey.locale = "fr";
  survey.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));

    // Send data to your server here
    axios
      .post(
        "https://testaptitude.aacomacademie.com/back_end/mailing.php",
        sender.data
      ) // Replace with your server URL
      .then((response) => {
        console.log("Data successfully submitted", response);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });

    setQuizStart(true);
  });

  surveyQuiz.locale = "fr";
  surveyQuiz.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));

    setCanTakeTest(false);

    const currentTime = new Date().getTime();
    localStorage.setItem("lastSubmissionTime", currentTime.toString());
  });

  surveyEnd.locale = "fr";
  surveyEnd.onComplete.add((sender, options) => {
    console.log(JSON.stringify(sender.data, null, 3));
  });

  survey.addLayoutElement({
    id: "progressbar-percentage",
    component: "sv-progressbar-percentage",
    container: "contentTop",
    data: survey,
  });

  surveyQuiz.addLayoutElement({
    id: "progressbar-percentage",
    component: "sv-progressbar-percentage",
    container: "contentTop",
    data: surveyQuiz,
  });

  return (
    <Survey
      model={
        canTakeTest === false ? surveyEnd : quizStart ? surveyQuiz : survey
      }
    />
  );
}

export default SurveyComponent;
