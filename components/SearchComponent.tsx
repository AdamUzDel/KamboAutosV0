'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import { CarMaker, ModelLine, Year, Modification } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SearchComponentProps {
  initialCategory?: string;
}

export function SearchComponent({ initialCategory }: SearchComponentProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [carMakers, setCarMakers] = useState<CarMaker[]>([])
  const [modelLines, setModelLines] = useState<ModelLine[]>([])
  const [years, setYears] = useState<Year[]>([])
  const [modifications, setModifications] = useState<Modification[]>([])

  const [selectedCarMaker, setSelectedCarMaker] = useState(searchParams.get('carMaker') || '')
  const [selectedModelLine, setSelectedModelLine] = useState(searchParams.get('modelLine') || '')
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '')
  const [selectedModification, setSelectedModification] = useState(searchParams.get('modification') || '')
  const [isLoading, setIsLoading] = useState(false)

  // Handler functions to reset dependent selections
  const handleCarMakerChange = (value: string) => {
    setSelectedCarMaker(value);
    setSelectedModelLine('');
    setSelectedYear('');
    setSelectedModification('');
    setModelLines([]);
    setYears([]);
    setModifications([]);
  };

  const handleModelLineChange = (value: string) => {
    setSelectedModelLine(value);
    setSelectedYear('');
    setSelectedModification('');
    setYears([]);
    setModifications([]);
  };

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    setSelectedModification('');
    setModifications([]);
  };

  useEffect(() => {
    async function fetchCarMakers() {
      try {
        const response = await fetch('/api/car-makers')
        const makers = await response.json()
        setCarMakers(makers)
      } catch (error) {
        console.error("Failed to fetch car makers", error)
      }
    }
    fetchCarMakers()
  }, [])

  useEffect(() => {
    async function fetchModelLines() {
      if (selectedCarMaker) {
        try {
          const response = await fetch(`/api/model-lines?carMakerId=${selectedCarMaker}`);
          const lines = await response.json();
          setModelLines(lines);
        } catch (error) {
          console.error('Error fetching model lines:', error);
        }
      } else {
        setModelLines([]);
      }
    }
    fetchModelLines();
  }, [selectedCarMaker]);

  useEffect(() => {
    async function fetchYears() {
      if (selectedModelLine) {
        try {
          const response = await fetch(`/api/years?modelLineId=${selectedModelLine}`);
          const yearsData = await response.json();
          setYears(yearsData);
        } catch (error) {
          console.error('Error fetching years:', error);
        }
      } else {
        setYears([]);
      }
    }
    fetchYears();
  }, [selectedModelLine]);

  useEffect(() => {
    async function fetchModifications() {
      if (selectedYear) {
        try {
          const response = await fetch(`/api/modifications?yearId=${selectedYear}`);
          const mods = await response.json();
          setModifications(mods);
        } catch (error) {
          console.error('Error fetching modifications:', error);
        }
      } else {
        setModifications([]);
      }
    }
    fetchModifications();
  }, [selectedYear]);

  const handleSearch = async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      ...(selectedCarMaker && { carMaker: selectedCarMaker }),
      ...(selectedModelLine && { modelLine: selectedModelLine }),
      ...(selectedYear && { year: selectedYear }),
      ...(selectedModification && { modification: selectedModification }),
      ...(initialCategory && { category: initialCategory }),
    });

    if (pathname === '/search') {
      // If we're already on the search page, update the URL without navigation
      router.push(`/search?${params.toString()}`, { scroll: false });
    } else {
      // If we're on any other page, navigate to the search page
      router.push(`/search?${params.toString()}`);
    }
    setIsLoading(false);
  }

  const isSearchDisabled = !selectedCarMaker || !selectedModelLine || !selectedYear || !selectedModification;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop by car</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select onValueChange={handleCarMakerChange} value={selectedCarMaker}>
            <SelectTrigger>
              <SelectValue placeholder="Select Car Maker" />
            </SelectTrigger>
            <SelectContent>
              {carMakers.map((maker) => (
                <SelectItem key={maker.id} value={maker.id}>
                  {maker.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleModelLineChange} value={selectedModelLine} disabled={!selectedCarMaker}>
            <SelectTrigger>
              <SelectValue placeholder="Select Model Line" />
            </SelectTrigger>
            <SelectContent>
              {modelLines.map((line) => (
                <SelectItem key={line.id} value={line.id}>{line.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={handleYearChange} value={selectedYear} disabled={!selectedModelLine}>
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.id} value={year.id}>{year.year.toString()}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedModification} value={selectedModification} disabled={!selectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select Modification" />
            </SelectTrigger>
            <SelectContent>
              {modifications.map((mod) => (
                <SelectItem key={mod.id} value={mod.id}>{mod.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="mt-4 w-full" onClick={handleSearch} disabled={isSearchDisabled || isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" /> Search Parts
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}