import 'package:flutter/material.dart';
import 'dart:ui';
import '../constants/design_constants.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final double opacity;
  final double borderRadius;
  final EdgeInsetsGeometry padding;
  final bool hasBorder;
  final Color borderColor;
  final List<BoxShadow>? customShadow;
  final GestureTapCallback? onTap;
  final double blurSigma;

  const GlassCard({
    Key? key,
    required this.child,
    this.opacity = 0.1,
    this.borderRadius = 20,
    this.padding = const EdgeInsets.all(16),
    this.hasBorder = true,
    this.borderColor = Colors.white,
    this.customShadow,
    this.onTap,
    this.blurSigma = 10,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blurSigma, sigmaY: blurSigma),
        child: GestureDetector(
          onTap: onTap,
          child: Container(
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(opacity),
              borderRadius: BorderRadius.circular(borderRadius),
              border: hasBorder
                  ? Border.all(
                      color: borderColor.withOpacity(0.2),
                      width: 1.5,
                    )
                  : null,
              boxShadow: customShadow ?? DesignConstants.shadowElevation2,
            ),
            padding: padding,
            child: child,
          ),
        ),
      ),
    );
  }
}

class PremiumCard extends StatelessWidget {
  final Widget child;
  final Gradient? gradient;
  final double borderRadius;
  final EdgeInsetsGeometry padding;
  final List<BoxShadow>? customShadow;
  final GestureTapCallback? onTap;

  const PremiumCard({
    Key? key,
    required this.child,
    this.gradient,
    this.borderRadius = 20,
    this.padding = const EdgeInsets.all(20),
    this.customShadow,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(borderRadius),
          boxShadow: customShadow ?? DesignConstants.shadowElevation3,
        ),
        padding: padding,
        child: child,
      ),
    );
  }
}
