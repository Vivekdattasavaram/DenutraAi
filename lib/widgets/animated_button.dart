import 'package:flutter/material.dart';
import '../constants/design_constants.dart';

class AnimatedPremiumButton extends StatefulWidget {
  final String label;
  final VoidCallback onPressed;
  final Gradient? gradient;
  final Color? backgroundColor;
  final double? width;
  final double height;
  final bool isLoading;
  final IconData? icon;
  final bool isOutlined;

  const AnimatedPremiumButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.gradient,
    this.backgroundColor,
    this.width,
    this.height = DesignConstants.buttonHeightMedium,
    this.isLoading = false,
    this.icon,
    this.isOutlined = false,
  }) : super(key: key);

  @override
  State<AnimatedPremiumButton> createState() => _AnimatedPremiumButtonState();
}

class _AnimatedPremiumButtonState extends State<AnimatedPremiumButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: DesignConstants.durationNormal,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails details) {
    _controller.forward();
  }

  void _onTapUp(TapUpDetails details) {
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: _onTapDown,
      onTapUp: _onTapUp,
      onTapCancel: () => _controller.reverse(),
      onTap: widget.isLoading ? null : widget.onPressed,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: widget.isOutlined
            ? _buildOutlinedButton()
            : _buildFilledButton(),
      ),
    );
  }

  Widget _buildOutlinedButton() {
    return Container(
      width: widget.width,
      height: widget.height,
      decoration: BoxDecoration(
        border: Border.all(
          color: widget.backgroundColor ?? Colors.blue,
          width: 2,
        ),
        borderRadius: BorderRadius.circular(DesignConstants.radiusLg),
      ),
      child: _buildButtonContent(),
    );
  }

  Widget _buildFilledButton() {
    return Container(
      width: widget.width,
      height: widget.height,
      decoration: BoxDecoration(
        gradient: widget.gradient,
        color: widget.gradient == null ? widget.backgroundColor : null,
        borderRadius: BorderRadius.circular(DesignConstants.radiusLg),
        boxShadow: DesignConstants.shadowElevation3,
      ),
      child: _buildButtonContent(),
    );
  }

  Widget _buildButtonContent() {
    return Center(
      child: widget.isLoading
          ? SizedBox(
              height: widget.height - 16,
              width: widget.height - 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(
                  widget.isOutlined
                      ? widget.backgroundColor ?? Colors.blue
                      : Colors.white,
                ),
              ),
            )
          : Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                if (widget.icon != null) ...[
                  Icon(
                    widget.icon,
                    color: widget.isOutlined ? null : Colors.white,
                  ),
                  const SizedBox(width: DesignConstants.sm),
                ],
                Text(
                  widget.label,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: widget.isOutlined ? null : Colors.white,
                  ),
                ),
              ],
            ),
    );
  }
}

class FloatingActionButtonPremium extends StatefulWidget {
  final IconData icon;
  final VoidCallback onPressed;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final String? tooltip;

  const FloatingActionButtonPremium({
    Key? key,
    required this.icon,
    required this.onPressed,
    this.backgroundColor,
    this.foregroundColor,
    this.tooltip,
  }) : super(key: key);

  @override
  State<FloatingActionButtonPremium> createState() =>
      _FloatingActionButtonPremiumState();
}

class _FloatingActionButtonPremiumState extends State<FloatingActionButtonPremium>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: DesignConstants.durationNormal,
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.9).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) => _controller.reverse(),
      onTapCancel: () => _controller.reverse(),
      onTap: widget.onPressed,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          width: 56,
          height: 56,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: widget.backgroundColor,
            boxShadow: DesignConstants.shadowElevation4,
          ),
          child: Icon(
            widget.icon,
            color: widget.foregroundColor ?? Colors.white,
          ),
        ),
      ),
    );
  }
}
