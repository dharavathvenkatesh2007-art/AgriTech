import time
import requests
import io
from PIL import Image

BASE_URL = 'http://127.0.0.1:5001'

def run_tests():
    print("--- STARTING FLASK AI SERVICE TESTS ---")
    
    # 1. Health check
    print("Testing /health endpoint...")
    try:
        r = requests.get(f"{BASE_URL}/health")
        print("Health status code:", r.status_code)
        print("Health response:", r.json())
        assert r.status_code == 200
        assert r.json()['status'] == 'ok'
    except Exception as e:
        print("❌ Health check failed:", e)
        return False

    # 2. Recommendation check (Paddy parameters)
    print("\nTesting /recommend endpoint (Paddy soil characteristics)...")
    payload = {
        "N": 80,
        "P": 45,
        "K": 40,
        "pH": 6.2,
        "temperature": 27.5,
        "rainfall": 1200,
        "state": "Andhra Pradesh"
    }
    try:
        r = requests.post(f"{BASE_URL}/recommend", json=payload)
        print("Recommend status code:", r.status_code)
        data = r.json()
        print("Recommend response:", data)
        assert r.status_code == 200
        assert 'recommendations' in data
        assert len(data['recommendations']) > 0
        # Paddy should have highest confidence based on ranges
        top_crop = data['recommendations'][0]['crop']
        print(f"Top recommended crop predicted: {top_crop}")
        assert top_crop == 'Paddy'
    except Exception as e:
        print("❌ Recommendation test failed:", e)
        return False

    # 3. Recommendation check (Sugarcane parameters)
    print("\nTesting /recommend endpoint (Sugarcane soil characteristics)...")
    payload = {
        "N": 120,
        "P": 65,
        "K": 80,
        "pH": 6.8,
        "temperature": 30.0,
        "rainfall": 1600,
        "state": "Maharashtra"
    }
    try:
        r = requests.post(f"{BASE_URL}/recommend", json=payload)
        print("Recommend status code:", r.status_code)
        data = r.json()
        print("Recommend response:", data)
        assert r.status_code == 200
        top_crop = data['recommendations'][0]['crop']
        print(f"Top recommended crop predicted: {top_crop}")
        assert top_crop == 'Sugarcane'
    except Exception as e:
        print("❌ Recommendation test (Sugarcane) failed:", e)
        return False

    # 4. Disease detection check (Healthy leaf)
    print("\nTesting /detect-disease endpoint with a generated green image (healthy)...")
    img_green = Image.new('RGB', (100, 100), color=(34, 139, 34)) # forest green
    img_byte_arr = io.BytesIO()
    img_green.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    files = {'image': ('cotton_healthy.jpg', img_byte_arr, 'image/jpeg')}
    try:
        r = requests.post(f"{BASE_URL}/detect-disease", files=files)
        print("Disease detection (healthy) status code:", r.status_code)
        data = r.json()
        print("Response:", data)
        assert r.status_code == 200
        assert data['disease'] == 'Healthy Leaf'
        assert data['crop'] == 'Cotton'
    except Exception as e:
        print("❌ Disease detection (healthy) failed:", e)
        return False

    # 5. Disease detection check (Diseased cotton leaf)
    print("\nTesting /detect-disease endpoint with a generated brown image (diseased)...")
    img_brown = Image.new('RGB', (100, 100), color=(139, 69, 19)) # saddle brown
    img_byte_arr = io.BytesIO()
    img_brown.save(img_byte_arr, format='JPEG')
    img_byte_arr.seek(0)
    
    files = {'image': ('cotton_leaf_spot.jpg', img_byte_arr, 'image/jpeg')}
    try:
        r = requests.post(f"{BASE_URL}/detect-disease", files=files)
        print("Disease detection (diseased) status code:", r.status_code)
        data = r.json()
        print("Response:", data)
        assert r.status_code == 200
        assert data['disease'] != 'Healthy Leaf'
        assert 'rust' in data['disease'].lower() or 'spot' in data['disease'].lower()
        assert data['crop'] == 'Cotton'
        assert 'expert_disclaimer' in data
        assert 'severity' in data
    except Exception as e:
        print("❌ Disease detection (diseased) failed:", e)
        return False

    # 6. Yield Prediction Check
    print("\nTesting /predict-yield endpoint...")
    yield_payload = {
        "crop_name": "Paddy",
        "area": 2.5,
        "N": 85,
        "P": 42,
        "K": 45,
        "pH": 6.5,
        "temperature": 28.5,
        "rainfall": 1050,
        "ndvi": 0.72
    }
    try:
        r = requests.post(f"{BASE_URL}/predict-yield", json=yield_payload)
        print("Yield prediction status code:", r.status_code)
        data = r.json()
        print("Yield response:", data)
        assert r.status_code == 200
        assert 'predicted_yield_per_acre' in data
        assert data['predicted_yield_per_acre'] > 0
        assert 'factors' in data
    except Exception as e:
        print("❌ Yield prediction test failed:", e)
        return False

    # 7. Smart Irrigation Check
    print("\nTesting /predict-irrigation endpoint...")
    irrigation_payload = {
        "crop_name": "Paddy",
        "growth_stage": "vegetative",
        "soil_moisture": 25.0,
        "field_capacity": 45.0,
        "wilting_point": 18.0,
        "temperature": 33.0,
        "humidity": 55.0,
        "solar_radiation": 24.0,
        "forecasted_rain_mm": 0.0
    }
    try:
        r = requests.post(f"{BASE_URL}/predict-irrigation", json=irrigation_payload)
        print("Irrigation status code:", r.status_code)
        data = r.json()
        print("Irrigation response:", data)
        assert r.status_code == 200
        assert data['irrigation_needed'] is True
        assert 'water_saving_analytics' in data
    except Exception as e:
        print("❌ Irrigation test failed:", e)
        return False

    # 8. Pest Detection Check
    print("\nTesting /detect-pests endpoint...")
    pest_payload = {
        "crop": "Cotton",
        "symptoms": "bollworm rosette flowers"
    }
    try:
        r = requests.post(f"{BASE_URL}/detect-pests", json=pest_payload)
        print("Pest status code:", r.status_code)
        data = r.json()
        print("Pest response:", data)
        assert r.status_code == 200
        assert 'Pink Bollworm' in data['detected_pest']
        assert 'expert_disclaimer' in data
    except Exception as e:
        print("❌ Pest detection test failed:", e)
        return False

    # 9. RAG Agronomic Chat Check
    print("\nTesting /rag-chat endpoint...")
    chat_payload = {
        "query": "How do I control paddy blast disease?"
    }
    try:
        r = requests.post(f"{BASE_URL}/rag-chat", json=chat_payload)
        print("RAG Chat status code:", r.status_code)
        data = r.json()
        print("Chat response:", data)
        assert r.status_code == 200
        assert data['verified_knowledge'] is True
        assert 'Tricyclazole' in data['response']
    except Exception as e:
        print("❌ RAG Chat test failed:", e)
        return False

    print("\n[SUCCESS] ALL FLASK AI SERVICE TESTS PASSED SUCCESSFULLY!")
    return True

if __name__ == '__main__':
    run_tests()

