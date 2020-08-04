package com.example.application;

import com.vaadin.flow.component.dependency.NpmPackage;
import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.server.PWA;

/**
 * Use the @PWA annotation make the application installable on phones, tablets
 * and some desktop browsers.
 */
@PWA(name = "v16-player", shortName = "v16-player", enableInstallPrompt = false)
@NpmPackage(value = "tone", version = "^14.7.35")
public class AppShell implements AppShellConfigurator {
}
