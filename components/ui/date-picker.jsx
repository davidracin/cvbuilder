"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cs } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ date, onDateChange, placeholder = "Vyberte datum", className }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP", { locale: cs }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            onDateChange(newDate)
            setIsOpen(false)
          }}
          locale={cs}
          captionLayout="dropdown"
          startMonth={new Date(1950, 0)}
          endMonth={new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}

export function MonthYearPicker({ date, onDateChange, placeholder = "Vyberte měsíc", className, allowCurrent = true }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClearOrCurrent = () => {
    onDateChange(undefined)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "LLLL yyyy", { locale: cs }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              onDateChange(newDate)
              setIsOpen(false)
            }}
            locale={cs}
            defaultMonth={date}
            captionLayout="dropdown"
            startMonth={new Date(1950, 0)}
            endMonth={new Date()}
          />
          {allowCurrent && (
            <div className="flex gap-2 border-t p-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleClearOrCurrent}
              >
                Současnost
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
