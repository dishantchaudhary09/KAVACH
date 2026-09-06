# Landslide ML Service - Ready Integration

This service contains the two usable trained scikit-learn models from the supplied Kavach/SIH project:

- `landslide_model.pkl` - RandomForest classifier trained on 9 landslide features.
- `flood_model.pkl` - RandomForest classifier trained on 6 flood features.

The supplied `flood_landslide_model.pkl` was empty/corrupt, and the original `app.py` used a `MockHybridModel` with randomly generated input. Therefore this ready service does NOT use the mock model and does NOT generate fake environmental inputs.

## Run locally

```bash
cd ml-service
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Service:
- `GET /`
- `GET /health`
- `POST /predict`

## Test request

POST `http://localhost:5000/predict`

JSON:

```json
{
  "location": "Aizawl, Mizoram",
  "rainfall_mm": 180,
  "slope_angle": 38,
  "soil_saturation": 0.72,
  "vegetation_cover": 0.35,
  "earthquake_activity": 2,
  "proximity_to_water": 0.20,
  "soil_type_gravel": 0,
  "soil_type_sand": 0,
  "soil_type_silt": 1,
  "river_level": 7,
  "soil_moisture": 0.72,
  "past_events": 3
}
```

## Important production rule

Do not send random values for soil, slope, earthquake activity, vegetation, river level, etc. Those values must come from trusted sources, GIS/terrain data, sensors, government datasets, or a clearly documented user/admin input.

The ML model is only as meaningful as the feature values supplied to it.

## Node integration

Your existing Node/Express backend should call this Python service. React should continue calling Node, not Flask directly.

Set:

```env
ML_SERVICE_URL=http://localhost:5000
```

Then create a Node service that POSTs to:

```text
${ML_SERVICE_URL}/predict
```

and returns the result to your existing risk controller.

For deployment, deploy this Python folder as a separate Render web service and change:

```env
ML_SERVICE_URL=https://YOUR-ML-SERVICE.onrender.com
```

in the Node backend.
