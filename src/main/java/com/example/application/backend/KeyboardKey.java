package com.example.application.backend;

public class KeyboardKey {

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    private String note;

    private String key;

    public KeyboardKey() {

    }

    public KeyboardKey(String note, String key) {
        this.note = note;
        this.key = key;
    }
}
