import os
import pickle
import numpy as np
import pandas as pd

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
CORS(app)


# ======================================
# LOAD ML MODELS
# ======================================

with open(os.path.join(BASE_DIR, "landslide_model.pkl"), "rb") as f:
    landslide_model = pickle.load(f)

with open(os.path.join(BASE_DIR, "flood_model.pkl"), "rb") as f:
    flood_model = pickle.load(f)


# ======================================
# MODEL FEATURES
# ======================================

LANDSLIDE_FEATURES = [
    "Rainfall_mm",
    "Slope_Angle",
    "Soil_Saturation",
    "Vegetation_Cover",
    "Earthquake_Activity",
    "Proximity_to_Water",
    "Soil_Type_Gravel",
    "Soil_Type_Sand",
    "Soil_Type_Silt"
]

FLOOD_FEATURES = [
    "rainfall",
    "river_level",
    "soil_moisture",
    "slope",
    "vegetation",
    "past_events"
]


# ======================================
# GET MODEL PROBABILITY
# ======================================

def get_probability(model, data):

    if hasattr(model, "predict_proba"):

        probabilities = model.predict_proba(data)

        classes = list(model.classes_)

        if 1 in classes:
            return float(
                probabilities[:, classes.index(1)][0]
            )

        return float(probabilities[:, -1][0])

    prediction = model.predict(data)

    return float(
        np.asarray(prediction).reshape(-1)[0]
    )


# ======================================
# RISK LEVEL
# ======================================

def get_risk_level(probability):

    if probability >= 0.70:
        return "HIGH"

    if probability >= 0.40:
        return "MEDIUM"

    return "LOW"


# ======================================
# HOME
# ======================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "success": True,
        "service": "Landslide ML Prediction Service",
        "status": "operational"
    })


# ======================================
# HEALTH CHECK
# ======================================

@app.route("/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "status": "healthy",
        "landslide_model_loaded": landslide_model is not None,
        "flood_model_loaded": flood_model is not None
    })


# ======================================
# LANDSLIDE + FLOOD PREDICTION
# ======================================

@app.route("/predict/landslide", methods=["POST"])
def predict_landslide():

    try:

        data = request.get_json(silent=True) or {}

        # ======================================
        # REQUIRED BASIC DATA
        # ======================================

        required_fields = [
            "latitude",
            "longitude",
            "rainfall",
            "temperature",
            "humidity",
            "windSpeed",

            # ML feature data
            "slope_angle",
            "soil_saturation",
            "vegetation_cover",
            "earthquake_activity",
            "proximity_to_water",
            "soil_type_gravel",
            "soil_type_sand",
            "soil_type_silt"
        ]

        missing_fields = [
            field
            for field in required_fields
            if data.get(field) is None
        ]

        if missing_fields:

            return jsonify({
                "success": False,
                "message": "Required prediction features are missing",
                "missing": missing_fields
            }), 400


        # ======================================
        # BASIC LOCATION + WEATHER DATA
        # ======================================

        latitude = float(data["latitude"])
        longitude = float(data["longitude"])

        rainfall = float(data["rainfall"])
        temperature = float(data["temperature"])
        humidity = float(data["humidity"])
        wind_speed = float(data["windSpeed"])


        # ======================================
        # LANDSLIDE FEATURES
        # ======================================

        slope_angle = float(
            data["slope_angle"]
        )

        soil_saturation = float(
            data["soil_saturation"]
        )

        vegetation_cover = float(
            data["vegetation_cover"]
        )

        earthquake_activity = float(
            data["earthquake_activity"]
        )

        proximity_to_water = float(
            data["proximity_to_water"]
        )

        soil_type_gravel = float(
            data["soil_type_gravel"]
        )

        soil_type_sand = float(
            data["soil_type_sand"]
        )

        soil_type_silt = float(
            data["soil_type_silt"]
        )


        # ======================================
        # FLOOD FEATURES
        # ======================================

        river_level = float(
            data.get("river_level", 0)
        )

        soil_moisture = float(
            data.get("soil_moisture", soil_saturation)
        )

        past_events = float(
            data.get("past_events", 0)
        )


        # ======================================
        # LANDSLIDE MODEL INPUT
        # ======================================

        landslide_input = pd.DataFrame(
            [{
                "Rainfall_mm": rainfall,
                "Slope_Angle": slope_angle,
                "Soil_Saturation": soil_saturation,
                "Vegetation_Cover": vegetation_cover,
                "Earthquake_Activity": earthquake_activity,
                "Proximity_to_Water": proximity_to_water,
                "Soil_Type_Gravel": soil_type_gravel,
                "Soil_Type_Sand": soil_type_sand,
                "Soil_Type_Silt": soil_type_silt
            }],
            columns=LANDSLIDE_FEATURES
        )


        # ======================================
        # FLOOD MODEL INPUT
        # ======================================

        flood_input = pd.DataFrame(
            [{
                "rainfall": rainfall,
                "river_level": river_level,
                "soil_moisture": soil_moisture,
                "slope": slope_angle,
                "vegetation": vegetation_cover,
                "past_events": past_events
            }],
            columns=FLOOD_FEATURES
        )


        # ======================================
        # PREDICTIONS
        # ======================================

        landslide_probability = get_probability(
            landslide_model,
            landslide_input
        )

        flood_probability = get_probability(
            flood_model,
            flood_input
        )


        # ======================================
        # RISK CALCULATION
        # ======================================

        overall_probability = max(
            landslide_probability,
            flood_probability
        )

        landslide_risk = get_risk_level(
            landslide_probability
        )

        flood_risk = get_risk_level(
            flood_probability
        )

        overall_risk = get_risk_level(
            overall_probability
        )


        risk_score = round(
            overall_probability * 100,
            2
        )


        # ======================================
        # REASON
        # ======================================

        reason = (
            f"Landslide risk is {landslide_risk} "
            f"and flood risk is {flood_risk}."
        )


        # ======================================
        # RESPONSE
        # ======================================

        return jsonify({

            "success": True,

            "riskLevel": overall_risk,

            "riskScore": risk_score,

            "reason": reason,

            "location": {
                "latitude": latitude,
                "longitude": longitude
            },

            "landslideProbability": round(
                landslide_probability,
                4
            ),

            "landslideRisk": landslide_risk,

            "floodProbability": round(
                flood_probability,
                4
            ),

            "floodRisk": flood_risk,

            "overallRisk": overall_risk,

            "features": {
                "rainfall": rainfall,
                "slopeAngle": slope_angle,
                "soilSaturation": soil_saturation,
                "vegetationCover": vegetation_cover,
                "earthquakeActivity": earthquake_activity,
                "proximityToWater": proximity_to_water,
                "soilTypeGravel": soil_type_gravel,
                "soilTypeSand": soil_type_sand,
                "soilTypeSilt": soil_type_silt
            }
        })


    except ValueError as e:

        return jsonify({
            "success": False,
            "message": f"Invalid numeric value: {str(e)}"
        }), 400


    except Exception as e:

        app.logger.exception(
            "Prediction failed"
        )

        return jsonify({
            "success": False,
            "message": "Prediction service error",
            "error": str(e)
        }), 500


# ======================================
# START SERVER
# ======================================

if __name__ == "__main__":

    port = int(
        os.getenv("PORT", "5000")
    )

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )