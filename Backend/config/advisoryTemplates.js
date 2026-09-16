const advisoryTemplates = {
  Paddy: [
    {
      dayNumber: 0,
      type: 'sowing',
      title: 'Paddy Sowing & Seed Treatment',
      messages: {
        English: 'Welcome to your Paddy advisory. Today is sowing day. Treat seeds with Carbendazim (2g/kg seed) to prevent seed-borne diseases before sowing in the nursery bed.',
        Telugu: 'వరి సాగు సలహాకు స్వాగతం. ఈ రోజు విత్తే రోజు. విత్తనాల ద్వారా వచ్చే తెగుళ్లను నివారించడానికి విత్తడానికి ముందు కార్బెండజిమ్ (కిలో విత్తనానికి 2 గ్రాములు) తో విత్తన శుద్ధి చేయండి.',
        Hindi: 'धान की खेती की सलाह में आपका स्वागत है। आज बुवाई का दिन है। बीज जनित रोगों से बचाव के लिए बुवाई से पहले बीजों को कार्बेन्डाजिम (2 ग्राम/किलोग्राम बीज) से उपचारित करें।'
      }
    },
    {
      dayNumber: 15,
      type: 'fertilizer',
      title: 'First Fertilizer Dose',
      messages: {
        English: 'Apply the first dose of nitrogen fertilizer. Mix 25 kg of Urea per acre. Ensure the field has light moisture and is weed-free.',
        Telugu: 'మొదటి విడత నత్రజని ఎరువును వేయండి. ఎకరాకు 25 కిలోల యూరియాను చల్లండి. పొలంలో తేలికపాటి తేమ ఉండేలా మరియు కలుపు లేకుండా చూసుకోండి.',
        Hindi: 'नाइट्रोजन उर्वरक की पहली खुराक डालें। प्रति एकड़ 25 किलोग्राम यूरिया का छिड़काव करें। सुनिश्चित करें कि खेत में हल्की नमी हो और खरपतवार न हो।'
      }
    },
    {
      dayNumber: 30,
      type: 'fertilizer',
      title: 'Second Fertilizer Dose & Tillering stage',
      messages: {
        English: 'This is the active tillering stage. Apply the second dose of fertilizer: 30 kg Urea and 10 kg Potash per acre.',
        Telugu: 'ఇది పిలకలు తొడిగే దశ. రెండవ విడత ఎరువును వేయండి: ఎకరాకు 30 కిలోల యూరియా మరియు 10 కిలోల పొటాష్.',
        Hindi: 'यह कल्ले निकलने की अवस्था है। उर्वरक की दूसरी खुराक डालें: प्रति एकड़ 30 किलोग्राम यूरिया और 10 किलोग्राम पोटाश।'
      }
    },
    {
      dayNumber: 45,
      type: 'disease',
      title: 'Stem Borer & Blast Prevention',
      messages: {
        English: 'Check for stem borer or blast disease. Spray Tricyclazole 120g per acre if yellow spots appear on leaves.',
        Telugu: 'కాండం తొలిచే పురుగు లేదా ఆకు ముడత తెగులును గమనించండి. ఆకులపై పసుపు మచ్చలు కనిపిస్తే ఎకరాకు 120 గ్రాముల ట్రైసైక్లాజోల్ పిచికారీ చేయండి.',
        Hindi: 'तना छेदक या ब्लास्ट रोग की जाँच करें। यदि पत्तियों पर पीले धब्बे दिखाई दें तो प्रति एकड़ 120 ग्राम ट्राइसाइक्लाजोल का छिड़काव करें।'
      }
    },
    {
      dayNumber: 60,
      type: 'irrigation',
      title: 'Water Management & Panicle Initiation',
      messages: {
        English: 'Panicle initiation stage. Keep a constant water depth of 2-3 cm. Do not let the soil dry out during this phase.',
        Telugu: 'పొట్ట దశ లేదా వెన్ను ముడుచుకునే దశ. పొలంలో నిరంతరం 2-3 సెం.మీ నీరు ఉండేలా చూసుకోండి. ఈ దశలో నేల ఎండిపోనివ్వవద్దు.',
        Hindi: 'बालियां निकलने की अवस्था। खेत में लगातार 2-3 सेमी पानी का स्तर बनाए रखें। इस चरण के दौरान मिट्टी को सूखने न दें।'
      }
    },
    {
      dayNumber: 90,
      type: 'weather',
      title: 'Pre-Harvest Field Preparation',
      messages: {
        English: 'Drain out water from the field 10-15 days before the expected harvest date to stimulate uniform ripening.',
        Telugu: 'వరి కోతకు 10-15 రోజుల ముందు పొలం నుండి నీటిని తీసివేయండి. ఇది గింజలు సమానంగా పక్వానికి రావడానికి సహాయపడుతుంది.',
        Hindi: 'कटाई की अपेक्षित तारीख से 10-15 दिन पहले खेत से पानी निकाल दें ताकि फसल समान रूप से पक सके।'
      }
    },
    {
      dayNumber: 105,
      type: 'harvest',
      title: 'Harvest & Marketing Advice',
      messages: {
        English: 'Harvest the crop when 80-85% of the grains turn golden yellow. Dry grains to 14% moisture before selling in the market.',
        Telugu: '80-85% గింజలు బంగారు పసుపు రంగులోకి మారినప్పుడు పంటను కోయండి. మార్కెట్లో విక్రయించడానికి ముందు గింజలను 14% తేమ వచ్చే వరకు ఆరబెట్టండి.',
        Hindi: 'जब 80-85% दाने सुनहरे पीले हो जाएं तो फसल की कटाई करें। बाजार में बेचने से पहले दानों को 14% नमी तक सुखा लें।'
      }
    }
  ],
  Cotton: [
    {
      dayNumber: 0,
      type: 'sowing',
      title: 'Cotton Sowing and Spacing',
      messages: {
        English: 'Welcome to your Cotton advisory. Today is sowing day. Maintain a spacing of 90cm x 60cm for Bt cotton to ensure healthy crop growth.',
        Telugu: 'పత్తి సాగు సలహాకు స్వాగతం. ఈ రోజు విత్తే రోజు. పత్తి మొక్కల ఆరోగ్యకరమైన పెరుగుదల కోసం 90 సెం.మీ x 60 సెం.మీ దూరం పాటించండి.',
        Hindi: 'कपास की खेती की सलाह में आपका स्वागत है। आज बुवाई का दिन है। स्वस्थ फसल विकास के लिए बीटी कपास के लिए 90 सेमी x 60 सेमी की दूरी बनाए रखें।'
      }
    },
    {
      dayNumber: 15,
      type: 'pesticide',
      title: 'Sucking Pest Management',
      messages: {
        English: 'Monitor for sucking pests like aphids and thrips. If infestation is observed, spray Imidacloprid (0.3 ml per liter of water).',
        Telugu: 'రసం పీల్చే పురుగులైన పేనుబంక, తామర పురుగులను గమనించండి. పురుగుల ఉధృతి ఉంటే లీటరు నీటికి 0.3 మి.లీ ఇమిడాక్లోప్రిడ్ చొప్పున పిచికారీ చేయండి.',
        Hindi: 'माहू और थ्रिप्स जैसे रस चूसने वाले कीटों की निगरानी करें। यदि कीट का प्रकोप दिखे तो इमिडाक्लोप्रिड (0.3 मिली प्रति लीटर पानी) का छिड़काव करें।'
      }
    },
    {
      dayNumber: 30,
      type: 'fertilizer',
      title: 'First Top Dressing',
      messages: {
        English: 'Apply the first top dressing of fertilizer. Use 35 kg of Urea and 15 kg of Muriate of Potash per acre.',
        Telugu: 'మొదటి విడత ఎరువులను వేయండి. ఎకరాకు 35 కిలోల యూరియా మరియు 15 కిలోల పొటాష్ ఉపయోగించండి.',
        Hindi: 'उर्वरक की पहली टॉप ड्रेसिंग करें। प्रति एकड़ 35 किलोग्राम यूरिया और 15 किलोग्राम मयुरिएट ऑफ पोटाश का प्रयोग करें।'
      }
    },
    {
      dayNumber: 45,
      type: 'disease',
      title: 'Square Formation and Disease Check',
      messages: {
        English: 'Look out for leaf spot and early square drop. Spray Carbendazim 250g per acre to control fungal diseases.',
        Telugu: 'ఆకు మచ్చ తెగులు మరియు మొగ్గలు రాలడాన్ని గమనించండి. శిలీంధ్ర తెగుళ్లను నియంత్రించడానికి ఎకరాకు 250 గ్రాముల కార్బెండజిమ్ పిచికారీ చేయండి.',
        Hindi: 'पत्ती धब्बा और कलियों के झड़ने की निगरानी करें। कवक जनित रोगों को नियंत्रित करने के लिए प्रति एकड़ 250 ग्राम कार्बेन्डाजिम का छिड़काव करें।'
      }
    },
    {
      dayNumber: 60,
      type: 'irrigation',
      title: 'Flowering & Water Control',
      messages: {
        English: 'Peak flowering stage. Ensure the crop has enough moisture. Avoid waterlogging as it can cause flower drop.',
        Telugu: 'పూత దశ అత్యంత కీలకం. పంటకు తగినంత తేమ ఉండేలా చూసుకోండి. నీరు నిల్వ ఉండకుండా చూసుకోండి, లేదంటే పూత రాలిపోతుంది.',
        Hindi: 'फूल आने की मुख्य अवस्था। सुनिश्चित करें कि फसल में पर्याप्त नमी हो। जलभराव से बचें क्योंकि इससे फूल झड़ सकते हैं।'
      }
    },
    {
      dayNumber: 90,
      type: 'pesticide',
      title: 'Bollworm Management',
      messages: {
        English: 'Inspect for Pink Bollworm. Install pheromone traps (5 per acre) and spray Profenofos if threshold is exceeded.',
        Telugu: 'గులాబీ రంగు కాయ తొలిచే పురుగును గమనించండి. ఎకరాకు 5 లింగాకర్షణ బుట్టలను అమర్చండి మరియు ఉధృతి ఎక్కువగా ఉంటే ప్రొఫెనోఫాస్ పిచికారీ చేయండి.',
        Hindi: 'गुलाबी सुंडी (पिंक बॉलवर्म) की निगरानी करें। प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं और जरूरत पड़ने पर प्रोफेनोफॉस का छिड़काव करें।'
      }
    },
    {
      dayNumber: 110,
      type: 'harvest',
      title: 'First Cotton Picking',
      messages: {
        English: 'Start picking cotton bolls that are fully opened. Pick in dry weather and store clean cotton separately to get better prices.',
        Telugu: 'బాగా విచ్చుకున్న పత్తి కాయలను ఏరడం ప్రారంభించండి. పొడి వాతావరణంలో ఏరండి మరియు మంచి ధర పొందడానికి శుభ్రమైన పత్తిని విడిగా నిల్వ చేయండి.',
        Hindi: 'पूरी तरह से खुले हुए कपास के गोलों की चुनाई शुरू करें। सूखे मौसम में चुनाई करें और बेहतर दाम पाने के लिए साफ कपास को अलग रखें।'
      }
    }
  ],
  Maize: [
    {
      dayNumber: 0,
      type: 'sowing',
      title: 'Maize Sowing Guidelines',
      messages: {
        English: 'Welcome to your Maize advisory. Sow seeds 3-5 cm deep at a spacing of 60cm between rows and 20cm between plants.',
        Telugu: 'మొక్కజొన్న సాగు సలహాకు స్వాగతం. విత్తనాలను 3-5 సెం.మీ లోతులో, వరుసల మధ్య 60 సెం.మీ మరియు మొక్కల మధ్య 20 సెం.మీ దూరం ఉండేలా విత్తండి.',
        Hindi: 'मक्का की खेती की सलाह में आपका स्वागत है। बीजों को 3-5 सेमी गहरा बोएं और कतारों के बीच 60 सेमी तथा पौधों के बीच 20 सेमी की दूरी रखें।'
      }
    },
    {
      dayNumber: 15,
      type: 'fertilizer',
      title: 'Early Growth and Weeding',
      messages: {
        English: 'Keep the field weed-free. Apply the first dose of Nitrogen (20 kg Nitrogen per acre equivalent) after manual weeding.',
        Telugu: 'పొలంలో కలుపు లేకుండా చూసుకోండి. చేతితో కలుపు తీసిన తర్వాత మొదటి విడత నత్రజని ఎరువును వేయండి.',
        Hindi: 'खेत को खरपतवार मुक्त रखें। हाथ से निराई करने के बाद नाइट्रोजन की पहली खुराक डालें।'
      }
    },
    {
      dayNumber: 30,
      type: 'pesticide',
      title: 'Fall Armyworm Prevention',
      messages: {
        English: 'Check the central whorl of maize for Fall Armyworm damage. Spray Emamectin Benzoate (80g per acre) if holes are found on leaves.',
        Telugu: 'మొక్కజొన్న సుడులలో లద్దె పురుగు ఆశించిందా అని గమనించండి. ఆకులపై రంధ్రాలు ఉంటే ఎకరాకు 80 గ్రాముల ఎమామెక్టిన్ బెంజోయేట్ పిచికారీ చేయండి.',
        Hindi: 'मक्के के पत्तों के बीच फॉल आर्मीवर्म के प्रकोप की जाँच करें। यदि पत्तियों पर छेद पाए जाएं तो प्रति एकड़ 80 ग्राम एमामेक्टिन बेंजोएट का छिड़काव करें।'
      }
    },
    {
      dayNumber: 45,
      type: 'fertilizer',
      title: 'Knee-High Stage Top Dressing',
      messages: {
        English: 'The crop is at knee-high stage. Apply the second dose of Nitrogen (35 kg Urea per acre) and earth-up the soil around plants.',
        Telugu: 'పంట మోకాలి ఎత్తు దశకు చేరుకుంది. రెండవ విడత నత్రజని (ఎకరాకు 35 కిలోల యూరియా) వేసి, మొక్కల మొదళ్లలో మట్టిని ఎగదోయండి.',
        Hindi: 'फसल घुटने की ऊंचाई तक पहुंच गई है। नाइट्रोजन की दूसरी खुराक (35 किलो यूरिया प्रति एकड़) डालें और पौधों के पास मिट्टी चढ़ाएं।'
      }
    },
    {
      dayNumber: 60,
      type: 'irrigation',
      title: 'Tasseling & Silking Irrigation',
      messages: {
        English: 'Tasseling and silking are critical water stages. Irrigate the field now to ensure optimal grain filling and cob development.',
        Telugu: 'పూత మరియు కంకి దశలు నీటి పారుదలకు అత్యంత కీలకం. గింజలు బాగా నిండటానికి మరియు కంకి అభివృద్ధికి ఇప్పుడు పొలానికి నీరు పెట్టండి.',
        Hindi: 'नर मंजरी (टैसेल) और भुट्टा (सिल्क) निकलने का चरण पानी के लिए बहुत महत्वपूर्ण है। दानों के विकास के लिए अभी सिंचाई करें।'
      }
    },
    {
      dayNumber: 90,
      type: 'weather',
      title: 'Physiological Maturity Check',
      messages: {
        English: 'Look for the black layer at the base of the grain, indicating physiological maturity. Stop irrigation to allow field drying.',
        Telugu: 'గింజ మొదలులో నల్లటి చార ఏర్పడిందో లేదో గమనించండి, ఇది పంట పక్వానికి వచ్చినట్లు సూచిస్తుంది. పొలం ఆరిపోవడానికి నీరు పెట్టడం ఆపండి.',
        Hindi: 'दाने के निचले हिस्से में काली परत (ब्लैक लेयर) की जाँच करें, जो पूर्ण परिपक्वता को दर्शाती है। खेत सुखाने के लिए सिंचाई बंद करें।'
      }
    },
    {
      dayNumber: 100,
      type: 'harvest',
      title: 'Maize Harvesting and Shelling',
      messages: {
        English: 'Harvest cobs when sheath cover turns dry and paper-like. De-husk and dry the cobs under the sun before shelling grains.',
        Telugu: 'కంకి పైపొర ఎండిపోయి కాగితంలా మారినప్పుడు పంటను కోయండి. పొత్తులు వలిచి, గింజలు వేరు చేయడానికి ముందు ఎండలో ఆరబెట్టండి.',
        Hindi: 'जब भुट्टे का बाहरी छिलका सूखकर कागज जैसा हो जाए तो भुट्टों की कटाई करें। दानों को निकालने से पहले भुट्टों को धूप में सुखाएं।'
      }
    }
  ]
};

export default advisoryTemplates;
