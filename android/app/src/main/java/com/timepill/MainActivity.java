package com.timepill;

import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(this.createSplashLayout());
    }

    public View createSplashLayout() {
        LayoutInflater inflate = LayoutInflater.from(this);
        View view = inflate.inflate(R.layout.splash_layout,null);
        return view;
    }
}
