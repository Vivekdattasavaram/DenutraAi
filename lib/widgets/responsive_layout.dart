import 'package:flutter/material.dart';
import '../constants/design_constants.dart';

class ResponsiveLayout extends StatelessWidget {
  final Widget mobileScaffold;
  final Widget? tabletScaffold;
  final Widget? desktopScaffold;

  const ResponsiveLayout({
    Key? key,
    required this.mobileScaffold,
    this.tabletScaffold,
    this.desktopScaffold,
  }) : super(key: key);

  static bool isMobile(BuildContext context) {
    return MediaQuery.of(context).size.width < DesignConstants.tabletBreakpoint;
  }

  static bool isTablet(BuildContext context) {
    return MediaQuery.of(context).size.width >= DesignConstants.tabletBreakpoint &&
        MediaQuery.of(context).size.width < DesignConstants.desktopBreakpoint;
  }

  static bool isDesktop(BuildContext context) {
    return MediaQuery.of(context).size.width >= DesignConstants.desktopBreakpoint;
  }

  static bool isLargeDesktop(BuildContext context) {
    return MediaQuery.of(context).size.width >=
        DesignConstants.largeDesktopBreakpoint;
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    if (size.width >= DesignConstants.desktopBreakpoint && desktopScaffold != null) {
      return desktopScaffold!;
    } else if (size.width >= DesignConstants.tabletBreakpoint && tabletScaffold != null) {
      return tabletScaffold!;
    }

    return mobileScaffold;
  }
}

class ResponsiveValue<T> {
  final T mobile;
  final T? tablet;
  final T? desktop;

  ResponsiveValue({
    required this.mobile,
    this.tablet,
    this.desktop,
  });

  T get(BuildContext context) {
    final size = MediaQuery.of(context).size;

    if (size.width >= DesignConstants.desktopBreakpoint && desktop != null) {
      return desktop!;
    } else if (size.width >= DesignConstants.tabletBreakpoint && tablet != null) {
      return tablet!;
    }

    return mobile;
  }
}
