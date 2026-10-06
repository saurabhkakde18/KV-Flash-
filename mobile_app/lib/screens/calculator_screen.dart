import 'package:flutter/material.dart';
import 'dart:math';
import '../constants/app_theme.dart';

class CalculatorScreen extends StatefulWidget {
  const CalculatorScreen({super.key});

  @override
  State<CalculatorScreen> createState() => _CalculatorScreenState();
}

class _CalculatorScreenState extends State<CalculatorScreen> {
  double _loanAmount = 500000;
  double _roi = 14.5;
  int _tenureMonths = 36;

  double get _monthlyEmi {
    final r = (_roi / 12) / 100;
    if (r == 0) return _loanAmount / _tenureMonths;
    final emi = (_loanAmount * r * pow(1 + r, _tenureMonths)) / (pow(1 + r, _tenureMonths) - 1);
    return emi;
  }

  double get _totalPayable => _monthlyEmi * _tenureMonths;
  double get _totalInterest => _totalPayable - _loanAmount;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.cardBg,
        elevation: 0,
        title: const Text(
          'Fast Vehicle Loan Calculator',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Result Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x44F59E0B),
                    blurRadius: 16,
                    offset: Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const Text(
                    'ESTIMATED MONTHLY EMI',
                    style: TextStyle(
                      color: Colors.black87,
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.0,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    '₹${_monthlyEmi.toStringAsFixed(0)}',
                    style: const TextStyle(
                      color: Colors.black,
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          const Text(
                            'Total Interest',
                            style: TextStyle(color: Colors.black87, fontSize: 11),
                          ),
                          Text(
                            '₹${_totalInterest.toStringAsFixed(0)}',
                            style: const TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                      Column(
                        children: [
                          const Text(
                            'Total Amount',
                            style: TextStyle(color: Colors.black87, fontSize: 11),
                          ),
                          Text(
                            '₹${_totalPayable.toStringAsFixed(0)}',
                            style: const TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Sliders & Inputs
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.cardBg,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.cardBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Loan Amount Slider
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Loan Amount',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      Text(
                        '₹${_loanAmount.toStringAsFixed(0)}',
                        style: const TextStyle(color: AppColors.gold, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                  Slider(
                    value: _loanAmount,
                    min: 50000,
                    max: 3000000,
                    divisions: 59,
                    activeColor: AppColors.gold,
                    inactiveColor: const Color(0xFF1E293B),
                    onChanged: (val) {
                      setState(() {
                        _loanAmount = val;
                      });
                    },
                  ),
                  const SizedBox(height: 14),

                  // ROI Slider
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Annual Interest Rate (IRR / ROI)',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      Text(
                        '${_roi.toStringAsFixed(1)}%',
                        style: const TextStyle(color: AppColors.sky, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                  Slider(
                    value: _roi,
                    min: 8.0,
                    max: 26.0,
                    divisions: 36,
                    activeColor: AppColors.sky,
                    inactiveColor: const Color(0xFF1E293B),
                    onChanged: (val) {
                      setState(() {
                        _roi = val;
                      });
                    },
                  ),
                  const SizedBox(height: 14),

                  // Tenure
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Tenure (Months)',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      Text(
                        '$_tenureMonths Months (${(_tenureMonths / 12).toStringAsFixed(1)} Yrs)',
                        style: const TextStyle(color: AppColors.iceBlue, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                    ],
                  ),
                  Slider(
                    value: _tenureMonths.toDouble(),
                    min: 12,
                    max: 84,
                    divisions: 6,
                    activeColor: AppColors.iceBlue,
                    inactiveColor: const Color(0xFF1E293B),
                    onChanged: (val) {
                      setState(() {
                        _tenureMonths = val.round();
                      });
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
