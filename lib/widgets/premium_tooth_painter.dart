import 'package:flutter/material.dart';

class PremiumToothPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final baseRect = Offset.zero & size;
    final toothPath = _createToothPath(size, Offset.zero);

    final shadowPaint = Paint()
      ..color = Colors.black.withOpacity(0.18)
      ..style = PaintingStyle.fill;
    canvas.drawPath(_createToothPath(size, Offset(4, 6)), shadowPaint);

    final bodyPaint = Paint()
      ..shader = LinearGradient(
        colors: [
          Color(0xFFFFFFFF),
          Color(0xFFF8FBFF),
          Color(0xFFDDE9FF),
        ],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(baseRect);
    canvas.drawPath(toothPath, bodyPaint);

    final sideGlossPaint = Paint()
      ..shader = LinearGradient(
        colors: [Colors.white.withOpacity(0.85), Colors.white.withOpacity(0.0)],
        begin: Alignment.topRight,
        end: Alignment.bottomLeft,
      ).createShader(baseRect);
    canvas.drawPath(toothPath, sideGlossPaint);

    final coolShadePaint = Paint()
      ..shader = LinearGradient(
        colors: [Colors.transparent, Color(0xFF60A5FA).withOpacity(0.08)],
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
      ).createShader(baseRect);
    canvas.drawPath(toothPath, coolShadePaint);

    final highlightPaint = Paint()
      ..shader = LinearGradient(
        colors: [Colors.white.withOpacity(0.95), Colors.white.withOpacity(0.0)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(Rect.fromLTWH(
        size.width * 0.16,
        size.height * 0.16,
        size.width * 0.28,
        size.height * 0.12,
      ));
    canvas.drawOval(
      Rect.fromLTWH(
        size.width * 0.16,
        size.height * 0.18,
        size.width * 0.32,
        size.height * 0.12,
      ),
      highlightPaint,
    );

    final glassPaint = Paint()
      ..shader = RadialGradient(
        colors: [Colors.white.withOpacity(0.45), Colors.white.withOpacity(0.0)],
        radius: 0.75,
        center: Alignment(-0.1, -0.4),
      ).createShader(baseRect);
    canvas.drawCircle(
      Offset(size.width * 0.46, size.height * 0.25),
      size.width * 0.12,
      glassPaint,
    );

    final linePaint = Paint()
      ..color = Color(0xFF3B82F6).withOpacity(0.22)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2;
    final wrinklePath = Path()
      ..moveTo(size.width * 0.38, size.height * 0.12)
      ..quadraticBezierTo(
        size.width * 0.44,
        size.height * 0.18,
        size.width * 0.50,
        size.height * 0.21,
      );
    canvas.drawPath(wrinklePath, linePaint);

    final outlinePaint = Paint()
      ..color = Color(0xFF60A5FA).withOpacity(0.5)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.8;
    canvas.drawPath(toothPath, outlinePaint);

    _drawSparkle(canvas, Offset(size.width * 0.82, size.height * 0.18), 6, Color(0xFF60A5FA));
    _drawSparkle(canvas, Offset(size.width * 0.16, size.height * 0.28), 4, Color(0xFF38BDF8));
  }

  void _drawSparkle(Canvas canvas, Offset center, double size, Color color) {
    final sparklePaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final sparklePath = Path()
      ..moveTo(center.dx, center.dy - size)
      ..lineTo(center.dx + size * 0.25, center.dy)
      ..lineTo(center.dx, center.dy + size)
      ..lineTo(center.dx - size * 0.25, center.dy)
      ..close();
    canvas.drawPath(sparklePath, sparklePaint);

    final strokePaint = Paint()
      ..color = Colors.white.withOpacity(0.9)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.2;
    canvas.drawLine(
      Offset(center.dx, center.dy - size * 1.2),
      Offset(center.dx, center.dy + size * 1.2),
      strokePaint,
    );
    canvas.drawLine(
      Offset(center.dx - size * 1.2, center.dy),
      Offset(center.dx + size * 1.2, center.dy),
      strokePaint,
    );
  }

  Path _createToothPath(Size size, Offset offset) {
    final path = Path();
    final w = size.width;
    final h = size.height;
    final dx = offset.dx;
    final dy = offset.dy;

    path.moveTo(dx + w * 0.20, dy + h * 0.14);
    path.cubicTo(
      dx + w * 0.10,
      dy + h * 0.06,
      dx + w * 0.05,
      dy + h * 0.26,
      dx + w * 0.05,
      dy + h * 0.42,
    );
    path.lineTo(dx + w * 0.05, dy + h * 0.70);
    path.cubicTo(
      dx + w * 0.05,
      dy + h * 0.80,
      dx + w * 0.11,
      dy + h * 0.88,
      dx + w * 0.20,
      dy + h * 0.88,
    );
    path.lineTo(dx + w * 0.32, dy + h * 0.96);
    path.cubicTo(
      dx + w * 0.36,
      dy + h * 0.995,
      dx + w * 0.64,
      dy + h * 0.995,
      dx + w * 0.68,
      dy + h * 0.96,
    );
    path.lineTo(dx + w * 0.80, dy + h * 0.88);
    path.cubicTo(
      dx + w * 0.90,
      dy + h * 0.88,
      dx + w * 0.95,
      dy + h * 0.80,
      dx + w * 0.95,
      dy + h * 0.70,
    );
    path.lineTo(dx + w * 0.95, dy + h * 0.42);
    path.cubicTo(
      dx + w * 0.95,
      dy + h * 0.26,
      dx + w * 0.90,
      dy + h * 0.06,
      dx + w * 0.80,
      dy + h * 0.14,
    );
    path.cubicTo(
      dx + w * 0.65,
      dy + h * 0.00,
      dx + w * 0.35,
      dy + h * 0.00,
      dx + w * 0.20,
      dy + h * 0.14,
    );
    path.close();
    return path;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
