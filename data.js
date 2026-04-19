// EpiGraph-AI Embedded Data
// Extracted from project CSV files

const DISTRICTS = ['Ahmedabad', 'Gandhinagar', 'Rajkot', 'Surat', 'Vadodara'];

const DISTRICT_COLORS = {
    Ahmedabad: '#3b82f6',
    Gandhinagar: '#8b5cf6',
    Rajkot: '#06b6d4',
    Surat: '#ec4899',
    Vadodara: '#10b981'
};

const PREDICTIONS = {
    Ahmedabad: { risk: 20.2, level: 'high' },
    Gandhinagar: { risk: 19.9, level: 'high' },
    Rajkot: { risk: 8.5, level: 'low' },
    Surat: { risk: 17.6, level: 'medium' },
    Vadodara: { risk: 27.3, level: 'high' }
};

const MODEL_METRICS = {
    r2: 0.585,
    rmse: 55.91,
    mae: 26.74,
    accuracy: 63.0,
    accuracy_strict: 52.7
};

const TRAINING_LOG = [
    { epoch: 10, train_loss: 0.290966, rmse: 79.67, mae: 35.20, r2: 0.1576, accuracy: 60.00, lr: 0.000794 },
    { epoch: 20, train_loss: 0.226428, rmse: 66.87, mae: 30.53, r2: 0.4064, accuracy: 63.64, lr: 0.000297 },
    { epoch: 30, train_loss: 0.204268, rmse: 56.30, mae: 27.41, r2: 0.5794, accuracy: 63.64, lr: 0.0000037 },
    { epoch: 40, train_loss: 0.190267, rmse: 53.02, mae: 25.07, r2: 0.6269, accuracy: 66.06, lr: 0.000946 },
    { epoch: 50, train_loss: 0.135714, rmse: 74.08, mae: 31.73, r2: 0.2717, accuracy: 65.45, lr: 0.000773 },
    { epoch: 60, train_loss: 0.104833, rmse: 79.93, mae: 31.85, r2: 0.1520, accuracy: 64.85, lr: 0.000527 },
    { epoch: 70, train_loss: 0.083927, rmse: 91.96, mae: 32.45, r2: -0.1224, accuracy: 66.06, lr: 0.000274 },
    { epoch: 80, train_loss: 0.070511, rmse: 90.19, mae: 33.56, r2: -0.0796, accuracy: 67.27, lr: 0.0000816 },
    { epoch: 90, train_loss: 0.065399, rmse: 89.26, mae: 32.97, r2: -0.0574, accuracy: 66.67, lr: 0.00000168 }
];

const CONNECTIVITY = [
    { source: 'Ahmedabad', target: 'Gandhinagar', weight: 1.0 },
    { source: 'Ahmedabad', target: 'Vadodara', weight: 0.9 },
    { source: 'Ahmedabad', target: 'Surat', weight: 0.7 },
    { source: 'Surat', target: 'Vadodara', weight: 0.8 },
    { source: 'Rajkot', target: 'Ahmedabad', weight: 0.5 },
    { source: 'Rajkot', target: 'Surat', weight: 0.4 }
];

const HEALTH_NEWS = [
    { date: '2010-01-03', district: 'Ahmedabad', headline: 'Health Emergency: Ahmedabad hospitals report surge in viral fever.', type: 'Medical_Alert' },
    { date: '2010-01-17', district: 'Ahmedabad', headline: 'Alert: Heavy monsoon and waterlogging reported in Ahmedabad.', type: 'Weather_Alert' },
    { date: '2010-03-28', district: 'Ahmedabad', headline: 'Health Emergency: Ahmedabad hospitals report surge in viral fever.', type: 'Medical_Alert' },
    { date: '2010-05-02', district: 'Ahmedabad', headline: 'Health Emergency: Ahmedabad hospitals report surge in viral fever.', type: 'Medical_Alert' },
    { date: '2010-01-10', district: 'Gandhinagar', headline: 'Alert: Heavy monsoon and waterlogging reported in Gandhinagar.', type: 'Weather_Alert' },
    { date: '2010-02-21', district: 'Gandhinagar', headline: 'Health Emergency: Gandhinagar hospitals report surge in viral fever.', type: 'Medical_Alert' },
    { date: '2010-03-14', district: 'Rajkot', headline: 'Alert: Heavy monsoon and waterlogging reported in Rajkot.', type: 'Weather_Alert' },
    { date: '2010-04-18', district: 'Rajkot', headline: 'Health Emergency: Rajkot hospitals report surge in viral fever.', type: 'Medical_Alert' },
    { date: '2010-02-14', district: 'Surat', headline: 'Alert: Heavy monsoon and waterlogging reported in Surat.', type: 'Weather_Alert' },
    { date: '2010-05-16', district: 'Surat', headline: 'Health Emergency: Surat hospitals report surge in viral fever.', type: 'Medical_Alert' },
    { date: '2010-01-24', district: 'Vadodara', headline: 'Alert: Heavy monsoon and waterlogging reported in Vadodara.', type: 'Weather_Alert' },
    { date: '2010-04-04', district: 'Vadodara', headline: 'Health Emergency: Vadodara hospitals report surge in viral fever.', type: 'Medical_Alert' }
];

// Aggregated weekly case data per district (sampled for chart visualization)
const WEEKLY_CASES = {
    Ahmedabad: [
        { d: '2010-01', v: 24 }, { d: '2010-02', v: 251 }, { d: '2010-03', v: 2 }, { d: '2010-04', v: 1 }, { d: '2010-05', v: 0 },
        { d: '2010-06', v: 0 }, { d: '2010-07', v: 2 }, { d: '2010-08', v: 0 }, { d: '2010-09', v: 7 }, { d: '2010-10', v: 1 },
        { d: '2010-11', v: 0 }, { d: '2010-12', v: 0 }, { d: '2010-13', v: 100 }, { d: '2010-14', v: 5 }, { d: '2010-15', v: 3 },
        { d: '2010-16', v: 0 }, { d: '2010-17', v: 0 }, { d: '2010-18', v: 8 }, { d: '2010-19', v: 0 }, { d: '2010-20', v: 724 },
        { d: '2010-21', v: 1 }, { d: '2010-22', v: 0 }, { d: '2010-23', v: 12 }, { d: '2010-24', v: 3 }, { d: '2010-25', v: 0 },
        { d: '2010-26', v: 0 }, { d: '2010-27', v: 0 }, { d: '2010-28', v: 32 }, { d: '2010-29', v: 3 }, { d: '2010-30', v: 2 },
        { d: '2010-31', v: 0 }, { d: '2010-32', v: 2 }, { d: '2010-33', v: 0 }, { d: '2010-34', v: 0 }, { d: '2010-35', v: 0 },
        { d: '2011-01', v: 30 }, { d: '2011-02', v: 1 }, { d: '2011-03', v: 0 }, { d: '2011-04', v: 0 }, { d: '2011-05', v: 145 },
        { d: '2011-06', v: 0 }, { d: '2011-07', v: 0 }, { d: '2011-08', v: 10 }, { d: '2011-09', v: 4 }, { d: '2011-10', v: 0 },
        { d: '2011-11', v: 0 }, { d: '2011-12', v: 15 }, { d: '2011-13', v: 5 }, { d: '2011-14', v: 0 }, { d: '2011-15', v: 0 },
        { d: '2011-16', v: 5 }, { d: '2011-17', v: 0 }, { d: '2011-18', v: 3 }, { d: '2011-19', v: 1 }, { d: '2011-20', v: 200 },
        { d: '2011-21', v: 2 }, { d: '2011-22', v: 10 }, { d: '2011-23', v: 1 }, { d: '2011-24', v: 0 }, { d: '2011-25', v: 0 },
        { d: '2011-26', v: 12 }, { d: '2011-27', v: 0 }, { d: '2011-28', v: 6 }, { d: '2011-29', v: 0 }, { d: '2011-30', v: 0 },
        { d: '2011-31', v: 5 }, { d: '2011-32', v: 0 }, { d: '2011-33', v: 0 }, { d: '2011-34', v: 3 }, { d: '2011-35', v: 0 },
        { d: '2012-01', v: 264 }, { d: '2012-02', v: 4 }, { d: '2012-03', v: 0 }, { d: '2012-04', v: 2 }, { d: '2012-05', v: 6 },
        { d: '2012-06', v: 33 }, { d: '2012-07', v: 11 }, { d: '2012-08', v: 49 }, { d: '2012-09', v: 8 }, { d: '2012-10', v: 1 },
        { d: '2012-11', v: 127 }, { d: '2012-12', v: 5 }, { d: '2012-13', v: 140 }, { d: '2012-14', v: 4 }, { d: '2012-15', v: 10 },
        { d: '2012-16', v: 107 }, { d: '2012-17', v: 24 }, { d: '2012-18', v: 264 }, { d: '2012-19', v: 4 }, { d: '2012-20', v: 4 },
        { d: '2012-21', v: 3 }, { d: '2012-22', v: 2 }, { d: '2012-23', v: 54 }, { d: '2012-24', v: 0 }, { d: '2012-25', v: 10 }
    ],
    Gandhinagar: [
        { d: '2010-01', v: 18 }, { d: '2010-02', v: 0 }, { d: '2010-03', v: 5 }, { d: '2010-04', v: 2 }, { d: '2010-05', v: 0 },
        { d: '2010-06', v: 3 }, { d: '2010-07', v: 0 }, { d: '2010-08', v: 8 }, { d: '2010-09', v: 1 }, { d: '2010-10', v: 15 },
        { d: '2010-11', v: 0 }, { d: '2010-12', v: 6 }, { d: '2010-13', v: 0 }, { d: '2010-14', v: 2 }, { d: '2010-15', v: 0 },
        { d: '2010-16', v: 85 }, { d: '2010-17', v: 0 }, { d: '2010-18', v: 3 }, { d: '2010-19', v: 7 }, { d: '2010-20', v: 150 },
        { d: '2010-21', v: 0 }, { d: '2010-22', v: 12 }, { d: '2010-23', v: 0 }, { d: '2010-24', v: 5 }, { d: '2010-25', v: 1 },
        { d: '2011-01', v: 20 }, { d: '2011-02', v: 0 }, { d: '2011-03', v: 3 }, { d: '2011-04', v: 7 }, { d: '2011-05', v: 85 },
        { d: '2011-06', v: 0 }, { d: '2011-07', v: 2 }, { d: '2011-08', v: 15 }, { d: '2011-09', v: 3 }, { d: '2011-10', v: 0 },
        { d: '2011-11', v: 10 }, { d: '2011-12', v: 0 }, { d: '2011-13', v: 5 }, { d: '2011-14', v: 0 }, { d: '2011-15', v: 120 },
        { d: '2012-01', v: 35 }, { d: '2012-02', v: 0 }, { d: '2012-03', v: 8 }, { d: '2012-04', v: 15 }, { d: '2012-05', v: 0 },
        { d: '2012-06', v: 42 }, { d: '2012-07', v: 3 }, { d: '2012-08', v: 0 }, { d: '2012-09', v: 18 }, { d: '2012-10', v: 7 }
    ],
    Rajkot: [
        { d: '2010-01', v: 5 }, { d: '2010-02', v: 0 }, { d: '2010-03', v: 2 }, { d: '2010-04', v: 0 }, { d: '2010-05', v: 1 },
        { d: '2010-06', v: 0 }, { d: '2010-07', v: 3 }, { d: '2010-08', v: 0 }, { d: '2010-09', v: 1 }, { d: '2010-10', v: 0 },
        { d: '2010-11', v: 0 }, { d: '2010-12', v: 2 }, { d: '2010-13', v: 0 }, { d: '2010-14', v: 1 }, { d: '2010-15', v: 4 },
        { d: '2010-16', v: 0 }, { d: '2010-17', v: 8 }, { d: '2010-18', v: 0 }, { d: '2010-19', v: 1 }, { d: '2010-20', v: 45 },
        { d: '2010-21', v: 0 }, { d: '2010-22', v: 3 }, { d: '2010-23', v: 0 }, { d: '2010-24', v: 1 }, { d: '2010-25', v: 0 },
        { d: '2011-01', v: 3 }, { d: '2011-02', v: 0 }, { d: '2011-03', v: 1 }, { d: '2011-04', v: 0 }, { d: '2011-05', v: 25 },
        { d: '2011-06', v: 0 }, { d: '2011-07', v: 2 }, { d: '2011-08', v: 0 }, { d: '2011-09', v: 1 }, { d: '2011-10', v: 0 },
        { d: '2012-01', v: 8 }, { d: '2012-02', v: 0 }, { d: '2012-03', v: 3 }, { d: '2012-04', v: 0 }, { d: '2012-05', v: 2 }
    ],
    Surat: [
        { d: '2010-01', v: 15 }, { d: '2010-02', v: 0 }, { d: '2010-03', v: 8 }, { d: '2010-04', v: 3 }, { d: '2010-05', v: 0 },
        { d: '2010-06', v: 5 }, { d: '2010-07', v: 0 }, { d: '2010-08', v: 12 }, { d: '2010-09', v: 0 }, { d: '2010-10', v: 7 },
        { d: '2010-11', v: 0 }, { d: '2010-12', v: 3 }, { d: '2010-13', v: 25 }, { d: '2010-14', v: 0 }, { d: '2010-15', v: 180 },
        { d: '2010-16', v: 0 }, { d: '2010-17', v: 8 }, { d: '2010-18', v: 2 }, { d: '2010-19', v: 0 }, { d: '2010-20', v: 350 },
        { d: '2010-21', v: 5 }, { d: '2010-22', v: 0 }, { d: '2010-23', v: 10 }, { d: '2010-24', v: 0 }, { d: '2010-25', v: 3 },
        { d: '2011-01', v: 22 }, { d: '2011-02', v: 3 }, { d: '2011-03', v: 0 }, { d: '2011-04', v: 10 }, { d: '2011-05', v: 120 },
        { d: '2011-06', v: 0 }, { d: '2011-07', v: 5 }, { d: '2011-08', v: 18 }, { d: '2011-09', v: 0 }, { d: '2011-10', v: 8 },
        { d: '2012-01', v: 45 }, { d: '2012-02', v: 0 }, { d: '2012-03', v: 12 }, { d: '2012-04', v: 5 }, { d: '2012-05', v: 0 }
    ],
    Vadodara: [
        { d: '2010-01', v: 20 }, { d: '2010-02', v: 3 }, { d: '2010-03', v: 0 }, { d: '2010-04', v: 7 }, { d: '2010-05', v: 0 },
        { d: '2010-06', v: 5 }, { d: '2010-07', v: 2 }, { d: '2010-08', v: 0 }, { d: '2010-09', v: 10 }, { d: '2010-10', v: 0 },
        { d: '2010-11', v: 3 }, { d: '2010-12', v: 0 }, { d: '2010-13', v: 45 }, { d: '2010-14', v: 0 }, { d: '2010-15', v: 210 },
        { d: '2010-16', v: 8 }, { d: '2010-17', v: 0 }, { d: '2010-18', v: 5 }, { d: '2010-19', v: 0 }, { d: '2010-20', v: 450 },
        { d: '2010-21', v: 2 }, { d: '2010-22', v: 0 }, { d: '2010-23', v: 15 }, { d: '2010-24', v: 0 }, { d: '2010-25', v: 5 },
        { d: '2011-01', v: 38 }, { d: '2011-02', v: 0 }, { d: '2011-03', v: 5 }, { d: '2011-04', v: 12 }, { d: '2011-05', v: 180 },
        { d: '2011-06', v: 0 }, { d: '2011-07', v: 8 }, { d: '2011-08', v: 25 }, { d: '2011-09', v: 3 }, { d: '2011-10', v: 0 },
        { d: '2012-01', v: 264 }, { d: '2012-02', v: 0 }, { d: '2012-03', v: 15 }, { d: '2012-04', v: 8 }, { d: '2012-05', v: 0 }
    ]
};

// Average weather data per district
const WEATHER_AVG = {
    Ahmedabad: { tmax: 34.2, tmin: 21.5, rain: 52.3, rh_am: 68, rh_pm: 42 },
    Gandhinagar: { tmax: 33.8, tmin: 20.9, rain: 48.7, rh_am: 70, rh_pm: 44 },
    Rajkot: { tmax: 33.5, tmin: 20.2, rain: 35.4, rh_am: 65, rh_pm: 38 },
    Surat: { tmax: 32.8, tmin: 22.1, rain: 78.5, rh_am: 75, rh_pm: 55 },
    Vadodara: { tmax: 33.1, tmin: 21.3, rain: 62.1, rh_am: 72, rh_pm: 48 }
};

const ARCHITECTURE = {
    input: { label: 'Input', dims: 'Batch × 7 × 5 × 781' },
    deepPath: [
        { label: 'BioBERT Projection', dims: '768 → 16', color: '#a855f7' },
        { label: 'GATv2 Layer 1', dims: '29 → 128 (2 heads)', color: '#06ccf9' },
        { label: 'ELU + Dropout', dims: '256', color: '#22d3ee' },
        { label: 'GATv2 Layer 2', dims: '256 → 128 (1 head)', color: '#06ccf9' },
        { label: 'LayerNorm', dims: '128', color: '#22d3ee' },
        { label: '2-Layer LSTM', dims: '128 → 128', color: '#f472b6' },
        { label: 'Temporal Attention', dims: 'Weighted Sum', color: '#34d399' },
        { label: 'Context Vector', dims: '128-dim', color: '#fbbf24' }
    ],
    skipPath: [
        { label: 'Last Timestep Features', dims: '13-dim', color: '#fb923c' },
        { label: 'FC → ReLU → FC', dims: '13 → 64 → 32', color: '#fb923c' },
        { label: 'Skip Features', dims: '32-dim', color: '#fbbf24' }
    ],
    combine: { label: 'Concat + FC', dims: '160 → 64 → 1' },
    output: { label: 'Output', dims: 'Batch × 5 × 1' }
};
