package com.example.application.backend;

import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Endpoint
@AnonymousAllowed
public class DataEndpoint {

    private List<KeyboardKey> keys;
    private List<String> saved;

    public DataEndpoint() {
        saved = new ArrayList<>();
        keys = new ArrayList<>();
        keys.add(getNote("C4", "q"));
        keys.add(getNote("C#4", "2"));
        keys.add(getNote("D4", "w"));
        keys.add(getNote("D#4", "3"));
        keys.add(getNote("E4", "e"));
        keys.add(getNote("F4", "r"));
        keys.add(getNote("F#4", "5"));
        keys.add(getNote("G4", "t"));
        keys.add(getNote("G#4", "6"));
        keys.add(getNote("A4", "y"));
        keys.add(getNote("A#4", "7"));
        keys.add(getNote("B4", "u"));
        keys.add(getNote("C5", "i"));
        keys.add(getNote("C#5", "9"));
        keys.add(getNote("D5", "o"));
        keys.add(getNote("D#5", "0"));
        keys.add(getNote("E5", "p"));

    }

    private KeyboardKey getNote(String note, String key) {
        return new KeyboardKey(note, key);
    }

    public List<KeyboardKey> getKeys() {
        return keys;
    }

    public void save(List<String> notes) {
        saved = new ArrayList<>();
        saved.addAll(notes);
    }

    public List<String> load() {
        return saved;
    }

}
