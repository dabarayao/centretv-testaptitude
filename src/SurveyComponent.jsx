import React from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import "survey-core/defaultV2.min.css";
import "./index.css";
import { json } from "./json";
import { Serializer } from "survey-core";
import { ReactSurveyElement, ReactElementFactory } from "survey-react-ui";

Serializer.addProperty("survey", "progressTitle");

class PercentageProgressBar extends ReactSurveyElement {
    render() {
        return (
            <div className="sv-progressbar-percentage">
              <div className="sv-progressbar-percentage__title">
                <span>{this.props.model.progressTitle}</span>
              </div>
              <div className="sv-progressbar-percentage__indicator">
                <div className="sv-progressbar-percentage__value-bar" style={{ width: this.props.model.progressValue + "%" }}></div>
              </div>
              <div className="sv-progressbar-percentage__value">
                <span>{this.props.model.progressValue + "%"}</span>
              </div>
            </div>
        );
    }
}

ReactElementFactory.Instance.registerElement("sv-progressbar-percentage", props => {
    return React.createElement(PercentageProgressBar, props);
});

function SurveyComponent() {
    const survey = new Model(json);
    survey.onComplete.add((sender, options) => {
        console.log(JSON.stringify(sender.data, null, 3));
    });
    survey.addLayoutElement({
        id: "progressbar-percentage",
        component: "sv-progressbar-percentage",
        container: "contentTop",
        data: survey
    });
    
    return (<Survey model={survey} />);
}

export default SurveyComponent;