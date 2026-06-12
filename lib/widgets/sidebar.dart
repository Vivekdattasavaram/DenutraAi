import 'package:flutter/material.dart';
import 'dart:ui';
import '../theme/theme.dart';
import '../constants/design_constants.dart';

class SidebarItem {
  final String label;
  final IconData icon;
  final String route;
  final VoidCallback onTap;

  SidebarItem({
    required this.label,
    required this.icon,
    required this.route,
    required this.onTap,
  });
}

class PremiumSidebar extends StatefulWidget {
  final List<SidebarItem> items;
  final String selectedRoute;
  final VoidCallback? onLogout;

  const PremiumSidebar({
    Key? key,
    required this.items,
    required this.selectedRoute,
    this.onLogout,
  }) : super(key: key);

  @override
  State<PremiumSidebar> createState() => _PremiumSidebarState();
}

class _PremiumSidebarState extends State<PremiumSidebar> {
  late List<SidebarItem> _items;

  @override
  void initState() {
    super.initState();
    _items = widget.items;
  }

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.only(
        topRight: Radius.circular(DesignConstants.radiusXxl),
        bottomRight: Radius.circular(DesignConstants.radiusXxl),
      ),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          width: 280,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.15),
            borderRadius: BorderRadius.only(
              topRight: Radius.circular(DesignConstants.radiusXxl),
              bottomRight: Radius.circular(DesignConstants.radiusXxl),
            ),
            border: Border(
              right: BorderSide(
                color: Colors.white.withOpacity(0.2),
                width: 1.5,
              ),
            ),
            boxShadow: DesignConstants.shadowElevation4,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Logo Section
                Padding(
                  padding: const EdgeInsets.all(DesignConstants.xl),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          gradient: AppTheme.primaryGradient,
                          borderRadius:
                              BorderRadius.circular(DesignConstants.radiusLg),
                        ),
                        child: const Icon(
                          Icons.health_and_safety_rounded,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: DesignConstants.md),
                      Text(
                        'DentAI',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: AppTheme.textDark,
                            ),
                      ),
                      const SizedBox(height: DesignConstants.xs),
                      Text(
                        'Oral Health Assistant',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppTheme.subtitleGray,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: DesignConstants.md),

                // Navigation Items
                ...List.generate(
                  _items.length,
                  (index) => _buildSidebarItem(
                    _items[index],
                    _items[index].route == widget.selectedRoute,
                  ),
                ),

                const SizedBox(height: DesignConstants.xl),

                // Logout Button
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: DesignConstants.lg,
                  ),
                  child: _buildLogoutButton(),
                ),

                const SizedBox(height: DesignConstants.lg),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSidebarItem(SidebarItem item, bool isSelected) {
    return GestureDetector(
      onTap: item.onTap,
      child: AnimatedContainer(
        duration: DesignConstants.durationNormal,
        margin: const EdgeInsets.symmetric(
          horizontal: DesignConstants.md,
          vertical: DesignConstants.xs,
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: DesignConstants.lg,
          vertical: DesignConstants.md,
        ),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.primaryDeepBlue.withOpacity(0.15)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(DesignConstants.radiusLg),
          border: isSelected
              ? Border.all(
                  color: AppTheme.primaryDeepBlue.withOpacity(0.3),
                  width: 1,
                )
              : null,
        ),
        child: Row(
          children: [
            Icon(
              item.icon,
              color: isSelected
                  ? AppTheme.primaryDeepBlue
                  : AppTheme.subtitleGray,
              size: DesignConstants.iconMd,
            ),
            const SizedBox(width: DesignConstants.md),
            Expanded(
              child: Text(
                item.label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  color: isSelected
                      ? AppTheme.primaryDeepBlue
                      : AppTheme.subtitleGray,
                ),
              ),
            ),
            if (isSelected) ...[
              const SizedBox(width: DesignConstants.sm),
              Container(
                width: 4,
                height: 20,
                decoration: BoxDecoration(
                  color: AppTheme.primaryDeepBlue,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildLogoutButton() {
    return GestureDetector(
      onTap: widget.onLogout,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(
          horizontal: DesignConstants.lg,
          vertical: DesignConstants.md,
        ),
        decoration: BoxDecoration(
          color: Colors.red.withOpacity(0.1),
          borderRadius: BorderRadius.circular(DesignConstants.radiusLg),
          border: Border.all(
            color: Colors.red.withOpacity(0.3),
            width: 1,
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.logout_rounded,
              color: Colors.red,
              size: DesignConstants.iconMd,
            ),
            const SizedBox(width: DesignConstants.sm),
            Text(
              'Logout',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
