from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Simple crop yield prediction model
# This is a simplified model - in production, you'd use a trained ML model
def predict_yield(crop, soil_type, annual_rainfall, avg_temperature, nitrogen, phosphorus, potassium):
    """
    Simple crop yield prediction based on input parameters.
    This is a rule-based model - replace with actual ML model in production.
    """
    # Base yields per crop (tonnes/hectare)
    base_yields = {
        'Corn': 8.0,
        'Wheat': 3.5,
        'Rice': 4.5,
        'Soybean': 2.8,
        'Cotton': 1.2
    }
    
    # Soil type multipliers
    soil_multipliers = {
        'Loam': 1.0,
        'Clay': 0.9,
        'Sandy': 0.85,
        'Silt': 1.05,
        'Peat': 0.95
    }
    
    # Get base yield
    base_yield = base_yields.get(crop, 5.0)
    
    # Apply soil type
    yield_value = base_yield * soil_multipliers.get(soil_type, 1.0)
    
    # Rainfall factor (optimal around 700-900mm)
    if 600 <= annual_rainfall <= 1000:
        rainfall_factor = 1.0
    elif annual_rainfall < 600:
        rainfall_factor = 0.7 + (annual_rainfall / 600) * 0.3
    else:
        rainfall_factor = 1.0 - min(0.3, (annual_rainfall - 1000) / 1000)
    
    yield_value *= rainfall_factor
    
    # Temperature factor (optimal around 20-25°C)
    if 18 <= avg_temperature <= 26:
        temp_factor = 1.0
    else:
        temp_factor = max(0.6, 1.0 - abs(avg_temperature - 22) / 20)
    
    yield_value *= temp_factor
    
    # Fertilizer factors (optimal ranges)
    n_factor = min(1.2, 0.8 + (nitrogen / 150) * 0.4) if nitrogen > 0 else 0.7
    p_factor = min(1.15, 0.85 + (phosphorus / 60) * 0.3) if phosphorus > 0 else 0.8
    k_factor = min(1.1, 0.9 + (potassium / 80) * 0.2) if potassium > 0 else 0.85
    
    yield_value *= (n_factor * p_factor * k_factor)
    
    # Round to 2 decimal places
    predicted_yield = round(yield_value, 2)
    
    # Calculate confidence (simplified)
    confidence = min(0.95, 0.7 + (
        (1.0 if 600 <= annual_rainfall <= 1000 else 0.8) +
        (1.0 if 18 <= avg_temperature <= 26 else 0.8) +
        (1.0 if 100 <= nitrogen <= 150 else 0.9) +
        (1.0 if 40 <= phosphorus <= 60 else 0.9) +
        (1.0 if 40 <= potassium <= 80 else 0.9)
    ) / 5 * 0.25)
    
    return predicted_yield, confidence

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['crop', 'soilType', 'annualRainfall', 'avgTemperature', 
                          'nitrogen', 'phosphorus', 'potassium']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Extract parameters
        crop = data['crop']
        soil_type = data['soilType']
        annual_rainfall = float(data['annualRainfall'])
        avg_temperature = float(data['avgTemperature'])
        nitrogen = float(data['nitrogen'])
        phosphorus = float(data['phosphorus'])
        potassium = float(data['potassium'])
        
        # Predict yield
        predicted_yield, confidence = predict_yield(
            crop, soil_type, annual_rainfall, avg_temperature,
            nitrogen, phosphorus, potassium
        )
        
        # Generate recommendations
        recommendations = []
        
        if annual_rainfall < 600:
            recommendations.append({
                'title': 'Increase Irrigation',
                'description': f'Annual rainfall ({annual_rainfall}mm) is below optimal. Consider implementing irrigation systems to maintain consistent soil moisture.'
            })
        elif annual_rainfall > 1000:
            recommendations.append({
                'title': 'Improve Drainage',
                'description': f'High rainfall ({annual_rainfall}mm) may cause waterlogging. Ensure proper drainage systems are in place.'
            })
        
        if avg_temperature < 18 or avg_temperature > 26:
            recommendations.append({
                'title': 'Temperature Management',
                'description': f'Average temperature ({avg_temperature}°C) is outside optimal range (18-26°C). Consider crop varieties adapted to your climate.'
            })
        
        if nitrogen < 100:
            recommendations.append({
                'title': 'Increase Nitrogen Application',
                'description': f'Current nitrogen level ({nitrogen} kg/ha) is below optimal. Consider applying additional nitrogen fertilizer to improve yield.'
            })
        elif nitrogen > 150:
            recommendations.append({
                'title': 'Reduce Nitrogen Application',
                'description': f'High nitrogen levels ({nitrogen} kg/ha) may not provide additional benefits and could lead to environmental issues.'
            })
        
        if phosphorus < 40:
            recommendations.append({
                'title': 'Add Phosphorus Fertilizer',
                'description': f'Phosphorus level ({phosphorus} kg/ha) is low. Adding phosphorus can improve root development and yield.'
            })
        
        if potassium < 40:
            recommendations.append({
                'title': 'Supplement Potassium',
                'description': f'Potassium level ({potassium} kg/ha) is below optimal. Adequate potassium improves disease resistance and crop quality.'
            })
        
        if not recommendations:
            recommendations.append({
                'title': 'Maintain Current Practices',
                'description': 'Your current parameters are within optimal ranges. Continue monitoring and maintain good agricultural practices.'
            })
        
        # Return prediction result
        result = {
            'predictedYield': predicted_yield,
            'unit': 'tonnes/hectare',
            'confidenceScore': round(confidence, 2),
            'recommendations': recommendations
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)



