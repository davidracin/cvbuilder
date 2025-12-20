"use client"

import { Palette, Type, Space, RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { FONT_OPTIONS } from "@/lib/constants";

function ColorPicker({ label, value, onChange, description }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">{label}</label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded border-2 border-border cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: value }}
            onClick={() => document.getElementById(`color-${label}`).click()}
          />
          <input
            id={`color-${label}`}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <span className="text-xs font-mono text-muted-foreground w-20">
            {value.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

function FontSelector({ label, value, onChange, description }) {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium block mb-1.5">{label}</label>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
        )}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded bg-sidebar-accent text-sidebar-accent-foreground focus:ring-2 focus:ring-sidebar-ring focus:border-sidebar-ring focus:outline-none transition-all"
        style={{ fontFamily: value }}
      >
        {FONT_OPTIONS.map((font) => (
          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
            {font.label}
          </option>
        ))}
      </select>
      <div className="p-3 border rounded bg-sidebar/30 text-center" style={{ fontFamily: value }}>
        <p className="text-sm">Příklad textu v tomto písmu</p>
        <p className="text-xs text-muted-foreground mt-1">The quick brown fox jumps</p>
      </div>
    </div>
  );
}

export default function DesignTab({ 
  designSettings, 
  onUpdateDesignSettings, 
  onResetDesignSettings,
  templateName 
}) {
  if (!designSettings) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        Načítání nastavení designu...
      </div>
    );
  }

  const { colors, fonts, spacing } = designSettings;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b">
        <div>
          <h3 className="font-semibold">Přizpůsobení designu</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upravte barvy, písma a rozložení šablony
          </p>
        </div>
        <Button
          onClick={onResetDesignSettings}
          variant="outline"
          size="sm"
          className="gap-1"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      <Accordion type="single" collapsible defaultValue="colors" className="w-full">
        <AccordionItem value="colors">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="font-medium">Barvy</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <ColorPicker
              label="Barva nadpisů"
              value={colors.primary}
              onChange={(value) => onUpdateDesignSettings("colors", "primary", value)}
              description="Hlavní barva pro nadpisy jednotlivých sekcí"
            />
            
            <ColorPicker
              label="Sekundární text"
              value={colors.textSecondary}
              onChange={(value) => onUpdateDesignSettings("colors", "textSecondary", value)}
              description="Barva pro pozice, firmy, školy a další informace"
            />
            
            <ColorPicker
              label="Barva textu"
              value={colors.text}
              onChange={(value) => onUpdateDesignSettings("colors", "text", value)}
              description="Barva pro popisky a dlouhé texty"
            />
            
            <ColorPicker
              label="Doplňková barva"
              value={colors.accent}
              onChange={(value) => onUpdateDesignSettings("colors", "accent", value)}
              description="Doplňková barva pro zvýraznění prvků, například podtržení nadpisů"
            />
            
            <ColorPicker
              label="Barva pozadí"
              value={colors.background}
              onChange={(value) => onUpdateDesignSettings("colors", "background", value)}
              description="Základní barva pozadí dokumentu"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="typography">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="font-medium">Typografie</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <FontSelector
              label="Písmo nadpisů"
              value={fonts.heading}
              onChange={(value) => onUpdateDesignSettings("fonts", "heading", value)}
              description="Písmo pro jméno, tituly sekcí"
            />
            
            <FontSelector
              label="Písmo těla textu"
              value={fonts.body}
              onChange={(value) => onUpdateDesignSettings("fonts", "body", value)}
              description="Písmo pro běžný text a odstavce"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spacing">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Space className="h-4 w-4" />
              <span className="font-medium">Rozložení</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-2">
                  Mezera mezi sekcemi
                </label>
                <p className="text-xs text-muted-foreground mb-3">
                  Vertikální mezera mezi jednotlivými sekcemi CV
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Slider
                  value={[spacing.section]}
                  onValueChange={(value) => onUpdateDesignSettings("spacing", "section", value[0])}
                  min={12}
                  max={40}
                  step={2}
                  className="flex-1"
                />
                <span className="text-sm font-mono w-12 text-right">
                  {spacing.section}px
                </span>
              </div>

              <div className="mt-4 p-3 border rounded bg-sidebar/30">
                <div className="space-y-1">
                  <div className="h-3 bg-primary/20 rounded"></div>
                  <div 
                    style={{ height: `${spacing.section}px` }}
                    className="bg-muted/30 rounded flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">Mezera</span>
                  </div>
                  <div className="h-3 bg-primary/20 rounded"></div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
