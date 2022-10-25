ffmpeg -r 1 -start_number 0 -start_number_range 6 -pattern_type sequence -i 'frame%d.png' -c:v libx264 -b:v 2M -pix_fmt yuva420p -vf fps=15 out.mp4
