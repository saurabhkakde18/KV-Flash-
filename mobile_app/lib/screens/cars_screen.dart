import 'package:flutter/material.dart';
import '../constants/app_theme.dart';

class CarsScreen extends StatefulWidget {
  const CarsScreen({super.key});

  @override
  State<CarsScreen> createState() => _CarsScreenState();
}

class _CarsScreenState extends State<CarsScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  final List<Map<String, dynamic>> _cars = const [
    {'oem': 'Maruti Suzuki', 'model': 'Swift / Dzire', 'owners': 'Up to 4th', 'segment': 'Hatchback', 'status': 'Approved'},
    {'oem': 'Hyundai', 'model': 'Creta', 'owners': 'Up to 4th', 'segment': 'SUV', 'status': 'Approved'},
    {'oem': 'Mahindra', 'model': 'Bolero / Bolero Maxi', 'owners': 'Up to 3rd', 'segment': 'LCV / Utility', 'status': 'Approved'},
    {'oem': 'Honda', 'model': 'City / Amaze', 'owners': 'Up to 4th', 'segment': 'Sedan', 'status': 'Approved'},
    {'oem': 'Tata', 'model': 'Nexon / Altroz', 'owners': 'Up to 4th', 'segment': 'Compact SUV', 'status': 'Approved'},
    {'oem': 'Toyota', 'model': 'Innova Crysta / Fortuner', 'owners': 'Up to 4th', 'segment': 'MUV / Premium', 'status': 'Approved'},
    {'oem': 'Mahindra', 'model': 'Scorpio-N / Classic', 'owners': 'Up to 4th', 'segment': 'SUV', 'status': 'Approved'},
    {'oem': 'Kia', 'model': 'Seltos / Sonet', 'owners': 'Up to 3rd', 'segment': 'SUV', 'status': 'Approved'},
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _cars.where((car) {
      final q = _searchQuery.toLowerCase();
      return car['model']!.toLowerCase().contains(q) ||
          car['oem']!.toLowerCase().contains(q) ||
          car['segment']!.toLowerCase().contains(q);
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.cardBg,
        elevation: 0,
        title: const Text(
          'Approved Vehicle Matrix (54 OEM)',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _searchController,
              onChanged: (val) => setState(() => _searchQuery = val),
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: InputDecoration(
                hintText: 'Search vehicle (Swift, Creta, Bolero, Innova)...',
                hintStyle: const TextStyle(color: Color(0xFF64748B), fontSize: 12),
                prefixIcon: const Icon(Icons.search, color: AppColors.gold, size: 18),
                filled: true,
                fillColor: AppColors.cardBg,
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: AppColors.cardBorder),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: AppColors.cardBorder),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: AppColors.gold),
                ),
              ),
            ),
            const SizedBox(height: 14),
            Expanded(
              child: ListView.separated(
                itemCount: filtered.length,
                separatorBuilder: (context, index) => const SizedBox(height: 10),
                itemBuilder: (context, index) {
                  final car = filtered[index];
                  return Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.cardBg,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.cardBorder),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              car['model']!,
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${car['oem']} • ${car['segment']}',
                              style: const TextStyle(
                                color: AppColors.textMuted,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0x2210B981),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0x6610B981)),
                          ),
                          child: Text(
                            car['owners']!,
                            style: const TextStyle(
                              color: Color(0xFF34D399),
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
