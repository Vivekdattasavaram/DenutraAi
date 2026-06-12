import 'package:flutter/material.dart';
import 'dart:ui';
import '../theme/theme.dart';
import '../constants/design_constants.dart';

class BottomNavItem {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool isSelected;

  BottomNavItem({
    required this.label,
    required this.icon,
    required this.onTap,
    this.isSelected = false,
  });
}

class PremiumBottomNavBar extends StatelessWidget {
  final List<BottomNavItem> items;
  final int selectedIndex;
  final Function(int) onItemSelected;

  const PremiumBottomNavBar({
    Key? key,
    required this.items,
    required this.selectedIndex,
    required this.onItemSelected,
  })  : assert(items.length > 0),
        super(key: key);

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: DesignConstants.lg,
      left: DesignConstants.lg,
      right: DesignConstants.lg,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(DesignConstants.radiusXxl),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(DesignConstants.radiusXxl),
              border: Border.all(
                color: Colors.white.withOpacity(0.2),
                width: 1.5,
              ),
              boxShadow: DesignConstants.shadowElevation4,
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: DesignConstants.md,
              vertical: DesignConstants.md,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(
                items.length,
                (index) => _buildNavItem(
                  context,
                  items[index],
                  index == selectedIndex,
                  () => onItemSelected(index),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(
    BuildContext context,
    BottomNavItem item,
    bool isSelected,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: DesignConstants.durationNormal,
        padding: EdgeInsets.symmetric(
          horizontal: isSelected ? DesignConstants.lg : DesignConstants.md,
          vertical: DesignConstants.md,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryDeepBlue.withOpacity(0.2)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(DesignConstants.radiusLg),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              item.icon,
              color: isSelected ? AppTheme.primaryDeepBlue : Colors.grey,
              size: DesignConstants.iconMd,
            ),
            if (isSelected) ...[
              const SizedBox(height: DesignConstants.xs),
              Text(
                item.label,
                style: TextStyle(
                  color: AppTheme.primaryDeepBlue,
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ]
          ],
        ),
      ),
    );
  }
}

class FloatingBottomNavBar extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onItemSelected;

  const FloatingBottomNavBar({
    Key? key,
    required this.selectedIndex,
    required this.onItemSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final navItems = [
      _NavItem(icon: Icons.home_rounded, label: 'Home'),
      _NavItem(icon: Icons.school_rounded, label: 'Learn'),
      _NavItem(icon: Icons.chat_rounded, label: 'Chat'),
      _NavItem(icon: Icons.play_circle_rounded, label: 'Videos'),
      _NavItem(icon: Icons.person_rounded, label: 'Profile'),
    ];

    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      child: Container(
        decoration: const BoxDecoration(
          color: Colors.transparent,
        ),
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).padding.bottom + DesignConstants.md,
          left: DesignConstants.lg,
          right: DesignConstants.lg,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(DesignConstants.radiusXxl),
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 15, sigmaY: 15),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.15),
                borderRadius: BorderRadius.circular(DesignConstants.radiusXxl),
                border: Border.all(
                  color: Colors.white.withOpacity(0.2),
                  width: 1.5,
                ),
                boxShadow: DesignConstants.shadowGlow,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(
                  navItems.length,
                  (index) => _buildNavButton(
                    navItems[index],
                    index == selectedIndex,
                    () => onItemSelected(index),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavButton(
    _NavItem item,
    bool isSelected,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Expanded(
        child: Padding(
          padding: const EdgeInsets.all(DesignConstants.md),
          child: AnimatedContainer(
            duration: DesignConstants.durationNormal,
            padding: EdgeInsets.all(
              isSelected ? DesignConstants.lg : DesignConstants.md,
            ),
            decoration: BoxDecoration(
              color: isSelected
                  ? AppTheme.primaryDeepBlue.withOpacity(0.3)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(DesignConstants.radiusLg),
            ),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    item.icon,
                    color: isSelected
                        ? AppTheme.primaryDeepBlue
                        : Colors.grey.shade600,
                    size: DesignConstants.iconMd,
                  ),
                  if (isSelected) ...[
                    const SizedBox(height: 4),
                    Text(
                      item.label,
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: AppTheme.primaryDeepBlue,
                      ),
                    ),
                  ]
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  final IconData icon;
  final String label;

  _NavItem({required this.icon, required this.label});
}
