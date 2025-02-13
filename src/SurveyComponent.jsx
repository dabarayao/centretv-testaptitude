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
  const [dataForm, setDataForm] = useState({});
  const [total, setTotal] = useState(0);

  // Check localStorage on component mount
  useEffect(() => {
    const lastSubmissionTime = localStorage.getItem("lastSubmissionTime");
    if (lastSubmissionTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - parseInt(lastSubmissionTime, 10);
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference < 24) {
        setCanTakeTest(false);
        localStorage.removeItem("lastSubmissionTime");
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
    const data = sender.data;

    setDataForm((prevState) => ({ prevState, ...data }));
    setQuizStart(true);
  });

  surveyQuiz.locale = "fr";
  surveyQuiz.onComplete.add((sender) => {
    let formData = new FormData();

    setCanTakeTest(false);

    const currentTime = new Date().getTime();
    localStorage.setItem("lastSubmissionTime", currentTime.toString());

    surveyQuiz.getAllQuestions().forEach(function (question) {
   
      formData.append(question.name, question.value);
    });

    formData.append(
      "total",
      surveyQuiz
        .getAllQuestions()
        .filter(
          (question) =>
            question.value === question.correctAnswer &&
            question.name.includes(5)
        ).length *
        5 +
        surveyQuiz
          .getAllQuestions()
          .filter(
            (question) =>
              question.value === question.correctAnswer &&
              question.name.includes(4)
          ).length *
          4
    );

    formData.append(
      "totalCorrect",
      surveyQuiz
        .getAllQuestions()
        .filter((question) => question.value === question.correctAnswer).length
    );

    for (let key in dataForm) {
      formData.append(key, dataForm[key]);
    }

    axios
      .post(
        "https://testaptitude.aacomacademie.com/back_end/mailing.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ) // Replace with your server URL
      .then((response) => {
        console.log("Data successfully submitted", response);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  });

  surveyEnd.locale = "fr";
  surveyEnd.onComplete.add((sender, options) => {});

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
