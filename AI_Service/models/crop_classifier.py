class PurePythonRandomForest:
    def __init__(self):
        self.classes_ = ['Paddy', 'Cotton', 'Chilli', 'Maize', 'Groundnut', 'Sugarcane', 'Wheat']
        
    def predict_proba(self, features):
        # features is a nested list: [[N, P, K, pH, temp, rainfall]]
        feat = features[0]
        N, P, K, pH, temp, rainfall = float(feat[0]), float(feat[1]), float(feat[2]), float(feat[3]), float(feat[4]), float(feat[5])
        
        scores = {}
        
        # 1. Paddy profile:
        # N: 60-100, P: 30-60, K: 30-50, pH: 5.5-7.0, temp: 20-30, rainfall: 1000-1600
        p_score = 0
        if 60 <= N <= 100: p_score += 3
        elif 40 <= N <= 120: p_score += 1.5
        if 30 <= P <= 60: p_score += 2
        if 30 <= K <= 50: p_score += 2
        if 5.5 <= pH <= 7.0: p_score += 2
        if 20 <= temp <= 30: p_score += 2
        if 1000 <= rainfall <= 1600: p_score += 5
        elif 800 <= rainfall <= 1800: p_score += 2.5
        scores['Paddy'] = p_score
        
        # 2. Cotton profile:
        # N: 40-90, P: 20-50, K: 40-75, pH: 6.0-7.8, temp: 25-35, rainfall: 600-1000
        c_score = 0
        if 40 <= N <= 90: c_score += 2.5
        if 20 <= P <= 50: c_score += 2
        if 40 <= K <= 75: c_score += 3
        if 6.0 <= pH <= 7.8: c_score += 2
        if 25 <= temp <= 35: c_score += 3
        if 600 <= rainfall <= 1000: c_score += 4
        elif 500 <= rainfall <= 1200: c_score += 2
        scores['Cotton'] = c_score

        # 3. Chilli profile:
        # High N (100-140), High P (50-75), High K (60-90), pH 6.0-7.2, temp 24-32, rainfall 600-900
        chilli_score = 0
        if 90 <= N <= 140: chilli_score += 4
        elif 70 <= N <= 150: chilli_score += 2
        if 45 <= P <= 75: chilli_score += 3
        if 55 <= K <= 95: chilli_score += 4
        if 6.0 <= pH <= 7.3: chilli_score += 2.5
        if 23 <= temp <= 33: chilli_score += 2.5
        if 550 <= rainfall <= 950: chilli_score += 3
        scores['Chilli'] = chilli_score

        # 4. Maize profile:
        # N: 70-120, P: 35-65, K: 30-55, pH: 6.0-7.5, temp: 20-30, rainfall: 700-1100
        m_score = 0
        if 70 <= N <= 120: m_score += 3
        if 35 <= P <= 65: m_score += 2.5
        if 30 <= K <= 55: m_score += 2
        if 6.0 <= pH <= 7.5: m_score += 2
        if 20 <= temp <= 30: m_score += 2.5
        if 700 <= rainfall <= 1100: m_score += 3.5
        scores['Maize'] = m_score

        # 5. Groundnut profile:
        # Low N requirement (10-35), P (25-45), K (20-40), pH 6.0-6.8, temp 22-32, rainfall 500-800
        g_score = 0
        if 10 <= N <= 40: g_score += 5  # Strong preference for lower N
        elif N < 50: g_score += 2.5
        if 20 <= P <= 45: g_score += 2.5
        if 15 <= K <= 40: g_score += 2.5
        if 5.8 <= pH <= 7.0: g_score += 2
        if 22 <= temp <= 33: g_score += 2
        if 450 <= rainfall <= 850: g_score += 4
        scores['Groundnut'] = g_score

        # 6. Sugarcane profile:
        # High N (120-170), High P (60-90), High K (70-120), pH 6.5-7.8, temp 25-36, rainfall 1200-2000
        s_score = 0
        if N >= 110: s_score += 4
        if P >= 55: s_score += 3
        if K >= 65: s_score += 3.5
        if 6.2 <= pH <= 8.0: s_score += 2
        if 25 <= temp <= 37: s_score += 3
        if rainfall >= 1100: s_score += 4.5
        scores['Sugarcane'] = s_score
        
        # 7. Wheat profile:
        # N (80-110), P (40-60), K (30-50), pH 6.0-7.5, temp 16-24 (Cooler), rainfall 400-650
        w_score = 0
        if 70 <= N <= 110: w_score += 3
        if 35 <= P <= 60: w_score += 2
        if 30 <= K <= 50: w_score += 2
        if 6.0 <= pH <= 7.5: w_score += 2
        if temp <= 25: w_score += 4.5 # Preference for cool weather
        if rainfall <= 700: w_score += 3.5
        scores['Wheat'] = w_score

        # Temperature & Rainfall penalties for extreme mismatches
        if rainfall > 1300:
            scores['Cotton'] *= 0.5
            scores['Groundnut'] *= 0.4
            scores['Wheat'] *= 0.3
        if temp > 32:
            scores['Wheat'] *= 0.2
        if N > 100:
            scores['Groundnut'] *= 0.3

        # Exponentiate / normalize scores to construct probability distribution
        import math
        exp_scores = {k: math.exp(v / 3.0) for k, v in scores.items()}
        total = sum(exp_scores.values())
        
        probs = [exp_scores[cls] / total for cls in self.classes_]
        return [probs]
